export type NodeVariant = "basic" | "conditional" | "loop";

export type NodeType = {
  id: string;
  type: NodeVariant;
  position: {
    x: number;
    y: number;
  };
  label: string;
};

export type MenuType = {
  id: string;
  top: number | false;
  left: number | false;
  right: number | false;
  bottom: number | false;
};

export type EdgeType = {
  id: string;
  source: string;
  target: string;
};

export type DataType = {
  nodes: NodeType[];
  edges: EdgeType[];
};
