import { Button } from "@mui/material";

interface Props {
  fractionId: string;
  text?: string;
  disabled?: boolean;
  className?: string;
}
export function SplitFractionButton({
  fractionId,
  text,
  className,
  disabled,
}: Props) {
  const onClick = async () => {
    console.log("Splitting fraction", fractionId);
  };

  return (
    <Button className={className} disabled={disabled} onClick={onClick}>
      {text}
    </Button>
  );
}
