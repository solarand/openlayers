interface Props {
  name: string;
  description?: string;
}

const PopupContent: React.FC<Props> = ({ name, description }) => {
  return (
    <div>
      <div style={{ fontWeight: "bold" }}>{name}</div>

      <div>{description}</div>
    </div>
  );
};

export default PopupContent;
