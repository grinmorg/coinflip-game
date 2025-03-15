import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  disabled?: boolean;
  desc?: React.JSX.Element | string;
  cancelBtnText?: string;
  confirmText?: React.ReactNode;
  destructive?: boolean;
  handleConfirm: () => void;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ConfirmDialog(
  props: ConfirmDialogProps
) {
  const {
    open,
    onOpenChange,
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    handleConfirm,
  } = props;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          className && className
        )}>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription asChild>
            <div>{desc}</div>
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='outline'
              disabled={isLoading}>
              {cancelBtnText ??
                "Закрыть"}
            </Button>
          </DialogClose>
          <Button
            variant={
              destructive
                ? "destructive"
                : "default"
            }
            onClick={handleConfirm}
            disabled={
              disabled || isLoading
            }>
            {confirmText ??
              "Подтвердить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
