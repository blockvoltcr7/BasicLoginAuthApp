import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import { Progress } from "./progress";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setScore(result.score);
      setFeedback(result.feedback.warning || result.feedback.suggestions[0] || "");
    } else {
      setScore(0);
      setFeedback("");
    }
  }, [password]);

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return "bg-red-500/50";
      case 1:
        return "bg-orange-500/50";
      case 2:
        return "bg-yellow-500/50";
      case 3:
        return "bg-lime-500/50";
      case 4:
        return "bg-green-500/50";
      default:
        return "bg-gray-200/20";
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "No Password";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Password Strength: <span className="text-white">{getStrengthText(score)}</span></span>
        <span className="text-gray-500">{score}/4</span>
      </div>
      <Progress value={(score / 4) * 100} className={`h-1 ${getStrengthColor(score)}`} />
      {feedback && (
        <p className="text-sm text-gray-400 mt-1">{feedback}</p>
      )}
    </div>
  );
}