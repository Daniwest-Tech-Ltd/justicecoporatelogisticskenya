-- Create analytics_daily table to store daily aggregated statistics
CREATE TABLE public.analytics_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_orders INTEGER NOT NULL DEFAULT 0,
  pending_orders INTEGER NOT NULL DEFAULT 0,
  approved_orders INTEGER NOT NULL DEFAULT 0,
  completed_orders INTEGER NOT NULL DEFAULT 0,
  rejected_orders INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  new_users INTEGER NOT NULL DEFAULT 0,
  new_vehicles INTEGER NOT NULL DEFAULT 0,
  new_messages INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics_monthly table for monthly summaries
CREATE TABLE public.analytics_monthly (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  avg_order_value NUMERIC NOT NULL DEFAULT 0,
  most_popular_vehicle_id UUID,
  total_users INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, month)
);

-- Create vehicle_analytics table to track per-vehicle statistics
CREATE TABLE public.vehicle_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  last_booked_at TIMESTAMP WITH TIME ZONE,
  avg_rental_days NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vehicle_id)
);

-- Enable RLS on analytics tables
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - only admins can view analytics
CREATE POLICY "Admins can view daily analytics" 
ON public.analytics_daily 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can manage daily analytics" 
ON public.analytics_daily 
FOR ALL 
USING (is_admin());

CREATE POLICY "Admins can view monthly analytics" 
ON public.analytics_monthly 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can manage monthly analytics" 
ON public.analytics_monthly 
FOR ALL 
USING (is_admin());

CREATE POLICY "Admins can view vehicle analytics" 
ON public.vehicle_analytics 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can manage vehicle analytics" 
ON public.vehicle_analytics 
FOR ALL 
USING (is_admin());

-- Create function to update analytics when order status changes
CREATE OR REPLACE FUNCTION public.update_order_analytics()
RETURNS TRIGGER AS $$
DECLARE
  order_date DATE;
  rental_days INTEGER;
  order_revenue NUMERIC;
  vehicle_price NUMERIC;
BEGIN
  order_date := DATE(COALESCE(NEW.created_at, NOW()));
  
  -- Calculate rental days and revenue
  IF NEW.pickup_date IS NOT NULL AND NEW.return_date IS NOT NULL THEN
    rental_days := GREATEST(1, NEW.return_date - NEW.pickup_date);
  ELSE
    rental_days := 1;
  END IF;
  
  -- Get vehicle price
  SELECT price_per_day INTO vehicle_price FROM vehicles WHERE id = NEW.vehicle_id;
  order_revenue := COALESCE(vehicle_price, 0) * rental_days;
  
  -- Upsert daily analytics
  INSERT INTO analytics_daily (date, total_orders, pending_orders, approved_orders, completed_orders, rejected_orders, total_revenue)
  VALUES (order_date, 1, 
    CASE WHEN NEW.status = 'pending' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status = 'rejected' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END
  )
  ON CONFLICT (date) DO UPDATE SET
    total_orders = analytics_daily.total_orders + 1,
    pending_orders = analytics_daily.pending_orders + CASE WHEN NEW.status = 'pending' THEN 1 ELSE 0 END,
    approved_orders = analytics_daily.approved_orders + CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
    completed_orders = analytics_daily.completed_orders + CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    rejected_orders = analytics_daily.rejected_orders + CASE WHEN NEW.status = 'rejected' THEN 1 ELSE 0 END,
    total_revenue = analytics_daily.total_revenue + CASE WHEN NEW.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END,
    updated_at = NOW();
  
  -- Upsert vehicle analytics
  INSERT INTO vehicle_analytics (vehicle_id, total_bookings, total_revenue, last_booked_at, avg_rental_days)
  VALUES (NEW.vehicle_id, 1, 
    CASE WHEN NEW.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END,
    NOW(), rental_days)
  ON CONFLICT (vehicle_id) DO UPDATE SET
    total_bookings = vehicle_analytics.total_bookings + 1,
    total_revenue = vehicle_analytics.total_revenue + CASE WHEN NEW.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END,
    last_booked_at = NOW(),
    avg_rental_days = (vehicle_analytics.avg_rental_days * vehicle_analytics.total_bookings + rental_days) / (vehicle_analytics.total_bookings + 1),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new orders
CREATE TRIGGER on_order_created
  AFTER INSERT ON rental_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_analytics();

-- Create function to update analytics when order status is updated
CREATE OR REPLACE FUNCTION public.update_order_status_analytics()
RETURNS TRIGGER AS $$
DECLARE
  order_date DATE;
  rental_days INTEGER;
  order_revenue NUMERIC;
  vehicle_price NUMERIC;
BEGIN
  -- Only process if status changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  order_date := DATE(NEW.created_at);
  
  -- Calculate rental days and revenue
  IF NEW.pickup_date IS NOT NULL AND NEW.return_date IS NOT NULL THEN
    rental_days := GREATEST(1, NEW.return_date - NEW.pickup_date);
  ELSE
    rental_days := 1;
  END IF;
  
  -- Get vehicle price
  SELECT price_per_day INTO vehicle_price FROM vehicles WHERE id = NEW.vehicle_id;
  order_revenue := COALESCE(vehicle_price, 0) * rental_days;
  
  -- Update daily analytics - decrement old status, increment new status
  UPDATE analytics_daily SET
    pending_orders = pending_orders 
      - CASE WHEN OLD.status = 'pending' THEN 1 ELSE 0 END
      + CASE WHEN NEW.status = 'pending' THEN 1 ELSE 0 END,
    approved_orders = approved_orders 
      - CASE WHEN OLD.status = 'approved' THEN 1 ELSE 0 END
      + CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END,
    completed_orders = completed_orders 
      - CASE WHEN OLD.status = 'completed' THEN 1 ELSE 0 END
      + CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    rejected_orders = rejected_orders 
      - CASE WHEN OLD.status = 'rejected' THEN 1 ELSE 0 END
      + CASE WHEN NEW.status = 'rejected' THEN 1 ELSE 0 END,
    total_revenue = total_revenue 
      - CASE WHEN OLD.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END
      + CASE WHEN NEW.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END,
    updated_at = NOW()
  WHERE date = order_date;
  
  -- Update vehicle analytics revenue
  UPDATE vehicle_analytics SET
    total_revenue = total_revenue 
      - CASE WHEN OLD.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END
      + CASE WHEN NEW.status IN ('approved', 'completed') THEN order_revenue ELSE 0 END,
    updated_at = NOW()
  WHERE vehicle_id = NEW.vehicle_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for order status updates
CREATE TRIGGER on_order_status_updated
  AFTER UPDATE ON rental_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status_analytics();