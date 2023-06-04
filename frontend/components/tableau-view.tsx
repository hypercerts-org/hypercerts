export interface TableauViewProps {
  className: string;
  projectLink: string;
}

export function TableauView(props: TableauViewProps) {
  const { className, projectLink } = props;
  return (
    <div className={className}>
      <p>{projectLink}</p>
    </div>
  );
}
