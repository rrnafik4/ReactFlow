import React, { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";
import { MenuType, NodeVariant } from "../types";

interface ContextMenuProps extends MenuType {
  onClick: () => void;
}

export const ContextMenu = ({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps) => {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(id) as Node;
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const contextMenuStyle = () => {
    const propsStyle = { top, left, right, bottom };
    let key: keyof typeof propsStyle;
    for (key in propsStyle) {
      if (!propsStyle[key]) {
        delete propsStyle[key];
      }
    }

    return propsStyle as Record<keyof typeof propsStyle, number>;
  };

  const changeNodeType = (nodeType: NodeVariant) => {
    setNodes((nodes) =>
      nodes.map((node) => (node.id === id ? { ...node, type: nodeType } : node))
    );
  };

  const styles = contextMenuStyle();

  const menu = () => {
    const nodeType = getNode(id)?.type as NodeVariant;
    const conditionalItem = (
      <button key={1} onClick={() => changeNodeType("conditional")}>
        Условие
      </button>
    );
    const loopItem = (
      <button key={2} onClick={() => changeNodeType("loop")}>
        Цикл
      </button>
    );
    const basicItem = (
      <button key={3} onClick={() => changeNodeType("basic")}>
        Блок
      </button>
    );
    const menuArr = [
      <button key={4} onClick={duplicateNode}>
        Дублировать
      </button>,
      <button key={5} onClick={deleteNode}>
        Удалить
      </button>,
    ];
    // if (nodeType === "conditional") {
    //   return [basicItem, loopItem, ...menuArr];
    // } else if (nodeType === "basic") {
    //   return [conditionalItem, loopItem, ...menuArr];
    // } else {
    //   return [basicItem, conditionalItem, ...menuArr];
    // }

    return menuArr;
  };

  return (
    <div style={styles} className="context-menu" {...props}>
      {menu().map((item) => item)}
    </div>
  );
};
