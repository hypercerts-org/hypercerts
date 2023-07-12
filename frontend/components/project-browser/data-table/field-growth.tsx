import { DataTableCellComponentProps } from "../../../lib/data-table";

type GrowthValue = {
  current: number;
  growth: number;
};

export function DataTableFieldGrowth(props: DataTableCellComponentProps) {
  console.log(`props for growth`);
  console.log(props);
  if (!props.value?.current || !props.value?.growth) {
    console.log("invalid");
    console.log(props);
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
    <div className={props.data._id + " growth-value"}>
      {props.value.current}{" "}
      <span className={growthType}>
        ({Math.round(props.value.growth * 100)}%)
      </span>
    </div>
  );
}
