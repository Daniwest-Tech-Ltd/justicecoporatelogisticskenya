import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-8">Terms of Rental</h1>
          
          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="font-heading text-xl font-bold mb-4">1. Rental Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                By renting a vehicle from Justice Corporate Logistics Kenya, you agree to be bound by these terms and conditions. 
                The rental agreement constitutes a legally binding contract between you (the "Renter") and Justice Corporate 
                Logistics Kenya (the "Company").
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">2. Driver Requirements</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Must be at least 23 years of age</li>
                <li>Must possess a valid Kenyan driving license or international driving permit</li>
                <li>Must have held a valid license for at least 2 years</li>
                <li>Must present a valid national ID or passport</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">3. Vehicle Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The rented vehicle must only be used for lawful purposes and within Kenya unless prior written approval 
                is obtained. The following uses are strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Off-road driving (unless specifically rented for such purpose)</li>
                <li>Racing or speed testing</li>
                <li>Towing other vehicles</li>
                <li>Transporting hazardous materials</li>
                <li>Use while under the influence of alcohol or drugs</li>
                <li>Sub-leasing or allowing unauthorized drivers</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">4. Insurance Coverage</h2>
              <p className="text-muted-foreground leading-relaxed">
                All our vehicles are comprehensively insured. However, the Renter is responsible for any excess amount 
                as specified in the rental agreement in case of an accident or damage. Insurance does not cover damage 
                caused by negligence or breach of rental terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">5. Fuel Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vehicles are provided with a full tank of fuel and must be returned with a full tank. If the vehicle 
                is not returned with a full tank, a refueling charge will apply based on current fuel prices plus a 
                service fee.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">6. Payment Terms</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Full payment is required before vehicle collection</li>
                <li>A security deposit is required and will be refunded upon safe return of the vehicle</li>
                <li>Accepted payment methods: M-Pesa, bank transfer, credit/debit cards</li>
                <li>Late returns will incur additional daily charges</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">7. Cancellation Policy</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Free cancellation up to 48 hours before pickup</li>
                <li>50% refund for cancellations made 24-48 hours before pickup</li>
                <li>No refund for cancellations made less than 24 hours before pickup</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">8. Breakdown & Emergency</h2>
              <p className="text-muted-foreground leading-relaxed">
                In case of breakdown or emergency, contact our 24/7 helpline immediately. Do not attempt repairs 
                without authorization. We provide roadside assistance for mechanical failures not caused by misuse.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">9. NTSA Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                All our vehicles are fully compliant with National Transport and Safety Authority (NTSA) regulations. 
                The Renter must adhere to all Kenyan traffic laws and regulations during the rental period.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-bold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any queries regarding these terms, please contact us at:<br />
                Email: rentals@justicelogisticskenya.com<br />
                Phone: 0702575512<br />
                Location: Mpesi Lane 11, Westlands, Nairobi, Kenya
              </p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Last updated: January 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
