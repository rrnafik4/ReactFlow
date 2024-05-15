import { useCallback } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import "./ConditionalBlock.css";

const lerftPointStyle = { left: 100, bottom: 96 };
const rightPointStyle = { right: 96, top: 100 };

export const ConditionalBlock = ({ id }: NodeProps) => {
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
    <div className="conditionalBlock">
      <Handle
        type="target"
        position={Position.Bottom}
        style={lerftPointStyle}
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Right}
        style={rightPointStyle}
        isConnectable={true}
      />
      <input className="text" value={value} onChange={onChange} />
    </div>
  );
};
