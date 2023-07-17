import { ExpandableIcon } from "./expandable-icon";
import { DataTableCellComponentProps } from "../../../lib/data-table";

type GrowthValue = {
  current: number;
  growth: number;
};

export function DataTableFieldGrowth(props: DataTableCellComponentProps) {
  console.log(`props for growth`);
  console.log(props);
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

  let expandable = <></>;
  if (props.field.expandable) {
    expandable = (
      <span
        onClick={(e) => {
          e.preventDefault();
          props.onExpand(props.data, props.field);
        }}
      >
        <ExpandableIcon isExpanded={props.isExpanded} />
      </span>
    );
  }

  return (
    <div className={props.data._id + " growth-value"}>
      {props.value.current.toLocaleString()}{" "}
      <span className={growthType.toLocaleLowerCase()}>
        ({Math.round(props.value.growth * 100)}%)
      </span>
      {expandable}
    </div>
  );
}
