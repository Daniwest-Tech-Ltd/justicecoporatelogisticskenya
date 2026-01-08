import { Check, X } from "lucide-react";
import { PasswordStrength } from "@/lib/passwordValidation";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  show: boolean;
}

const PasswordStrengthIndicator = ({ strength, show }: PasswordStrengthIndicatorProps) => {
  if (!show) return null;

  const requirements = [
    { key: "length", label: "At least 8 characters", met: strength.requirements.length },
    { key: "uppercase", label: "One uppercase letter", met: strength.requirements.uppercase },
    { key: "lowercase", label: "One lowercase letter", met: strength.requirements.lowercase },
    { key: "number", label: "One number", met: strength.requirements.number },
    { key: "special", label: "One special character (!@#$%^&*)", met: strength.requirements.special },
  ];

  return (
    <div className="mt-2 p-3 glass-card rounded-lg space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={`font-medium ${strength.score >= 4 ? "text-green-500" : strength.score >= 3 ? "text-yellow-500" : "text-red-500"}`}>
            {strength.label}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-1">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span className={req.met ? "text-green-500" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
