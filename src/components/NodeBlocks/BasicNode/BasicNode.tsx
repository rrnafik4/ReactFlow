import { useCallback } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

export const BasicNode = ({ id }: NodeProps) => {
  const { getNode, setNodes } = useReactFlow();
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { label: evt.target.value } } : node
        )
      );
    },
    [setNodes, id]
  );

  const value = getNode(id)?.data.label;

  return (
    <div className="basicNode">
      <Handle type="target" position={Position.Top} />
      <div>
        {value}
        {/* <input
          id="text"
          name="text"
          onChange={onChange}
          className="nodrag"
          value={value}
        /> */}
      </div>
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
};
