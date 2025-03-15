import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CircleCheckBigIcon } from "lucide-react";

export default function AlertSuccess({
  title,
  description,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <Alert className='border-emerald-600/50 text-emerald-600 dark:border-emerald-600 [&>svg]:text-emerald-600'>
      <CircleCheckBigIcon className='h-4 w-4' />
      <AlertTitle>{title}</AlertTitle>
      {description && (
        <AlertDescription>
          {description}
        </AlertDescription>
      )}
    </Alert>
  );
}
