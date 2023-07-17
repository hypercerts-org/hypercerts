import { DataTableCellComponentProps } from "../../../lib/data-table";

type GrowthValue = {
  current: number;
  growth: number;
};

export function DataTableFieldGrowth(props: DataTableCellComponentProps) {
  if (
    typeof props.value?.current !== "number" ||
    typeof props.value?.growth !== "number"
  ) {
    throw new Error("Growth Field value is invalid");
  }
  const value = props.value as GrowthValue;
  let growthType = "none";
  if (value.growth > 0) {
    growthType = "positive";
  }
  if (value.growth < 0) {
    growthType = "negative";
  }

  return (
    <span className={props.data._id + " growth-value"} style={props.style}>
      {props.value.current.toLocaleString()}{" "}
      <span className="growth-type">
        (
        <span className={growthType}>
          {Math.round(props.value.growth * 100).toLocaleString()}%
        </span>
        )
      </span>
    </span>
  );
}
