import React, { useState } from "react";
import { Flow } from "./Flow";

import { DataType, EdgeType, NodeType } from "./types";

import "./index.css";

const initialNodes: NodeType[] = [
  {
    id: "1",
    type: "basic",
    position: { x: 700, y: 0 },
    label: "1, Директор, Алексей Иванов Петрович",
  },
  {
    id: "2",
    type: "basic",
    position: { x: 900, y: 100 },
    label: "2, Технический менеджер , Екатерина Смирнова Александровна",
  },
  {
    id: "3",
    type: "basic",
    position: { x: 500, y: 100 },
    label: "3, Руководитель проекта, Дмитрий Козлов Владимирович",
  },
  {
    id: "4",
    type: "basic",
    position: { x: 700, y: 200 },
    label: "4, Руководитель разработки, Мария Новикова Сергеевна",
  },
  {
    id: "5",
    type: "basic",
    position: { x: 500, y: 300 },
    label: "5, Архитектор, Андрей Попов Игоревич",
  },
  {
    id: "6",
    type: "basic",
    position: { x: 900, y: 300 },
    label: "6, Технический аналитик, Ольга Морозова Андреевна",
  },
  {
    id: "7",
    type: "basic",
    position: { x: 900, y: 600 },
    label: "7, Системный администратор, Павел Ковалев Степанович",
  },
  {
    id: "8",
    type: "basic",
    position: { x: 700, y: 700 },
    label: "8, Сетевой инженер, Анастасия Федорова Павловна",
  },
  {
    id: "9",
    type: "basic",
    position: { x: 700, y: 800 },
    label: "9, Баз данных администратор , Иван Михайлов Александрович",
  },
  {
    id: "10",
    type: "basic",
    position: { x: 700, y: 900 },
    label: "10, Специалист по технической поддержке, Наталья Соколова Ивановна",
  },

  {
    id: "11",
    type: "basic",
    position: { x: 700, y: 1000 },
    label: "11, Программист, Сергей Васильев Алексеевич",
  },

  {
    id: "12",
    type: "basic",
    position: { x: 700, y: 1100 },
    label: "12, Ведущий инженер, Анна Петрова Борисовна",
  },
  {
    id: "13",
    type: "basic",
    position: { x: 700, y: 1200 },
    label: "13, Менеджер проектов, Максим Смирнов Игоревич",
  },

  {
    id: "14",
    type: "basic",
    position: { x: 700, y: 1300 },
    label: "14, Дизайнер, Ольга Иванова Сергеевна",
  },

  {
    id: "15",
    type: "basic",
    position: { x: 700, y: 1400 },
    label: "15, Инженер по тестированию, Николай Кузнецов Владимирович",
  },

  {
    id: "16",
    type: "basic",
    position: { x: 700, y: 1500 },
    label: "16, Аналитик, Виктория Николаева Евгеньевна",
  },
  {
    id: "17",
    type: "basic",
    position: { x: 700, y: 1600 },
    label: "17, Специалист по безопасности, Илья Морозов Петрович",
  },
  {
    id: "18",
    type: "basic",
    position: { x: 700, y: 1700 },
    label: "18, Веб-разработчик, Елена Ковалева Дмитриевна",
  },
  {
    id: "19",
    type: "basic",
    position: { x: 700, y: 1800 },
    label: "19, Системный аналитик, Артем Васильев Игоревич",
  },
  {
    id: "20",
    type: "basic",
    position: { x: 700, y: 1900 },
    label: "20, Специалист по DevOps, Виктор Смирнов Олегович",
  },
];
const initialEdges = [
  { id: "e19-20", source: "7", target: "19" },
  { id: "e1-2", source: "1", target: "2" },
  { id: "e3-4", source: "1", target: "3" },
  { id: "e2-3", source: "2", target: "4" },
  { id: "e4-5", source: "4", target: "5" },
  { id: "e5-6", source: "3", target: "4" },
  { id: "e6-7", source: "4", target: "6" },
  { id: "e7-8", source: "4", target: "7" },
  { id: "e8-9", source: "4", target: "8" },
  { id: "e9-10", source: "8", target: "9" },
  { id: "e10-11", source: "8", target: "10" },
  { id: "e11-12", source: "8", target: "11" },
  { id: "e12-13", source: "6", target: "17" },
  { id: "e13-14", source: "6", target: "18" },
  { id: "e14-15", source: "7", target: "12" },
  { id: "e15-16", source: "7", target: "13" },
  { id: "e16-17", source: "6", target: "14" },
  { id: "e17-18", source: "5", target: "15" },
  { id: "e18-1", source: "5", target: "16" },
  { id: "e18-19", source: "5", target: "20" },
];

function calculatePyramidLayout(
  nodes: NodeType[],
  edges: EdgeType[]
): NodeType[] {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const childrenMap = new Map<string, string[]>();

  edges.forEach((edge) => {
    if (!childrenMap.has(edge.source)) {
      childrenMap.set(edge.source, []);
    }
    childrenMap.get(edge.source)!.push(edge.target);
  });

  const rootId = "1";
  const levels: string[][] = [];
  const visited = new Set<string>();

  function traverse(nodeId: string, level: number) {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(nodeId);

      if (childrenMap.has(nodeId)) {
        childrenMap
          .get(nodeId)!
          .forEach((childId) => traverse(childId, level + 1));
      }
    }
  }

  traverse(rootId, 0);

  const horizontalSpacing = 200;
  const verticalSpacing = 200;

  const startX = 900; // Центрирование относительно начала координат (0, 0)

  levels.forEach((levelNodes, levelIndex) => {
    const y = levelIndex * verticalSpacing;
    const levelWidth = (levelNodes.length - 1) * horizontalSpacing;
    const offsetX = startX - levelWidth / 2;

    levelNodes.forEach((nodeId, nodeIndex) => {
      const x = offsetX + nodeIndex * horizontalSpacing;
      const node = nodeMap.get(nodeId);
      if (node) {
        node.position = { x, y };
      }
    });
  });

  return nodes;
}

const setPositionNodes = (): NodeType[] => {
  const updatedNodes = calculatePyramidLayout(initialNodes, initialEdges);
  return updatedNodes;
};

// Вызываем функцию setPositionNodes
const updatedNodes = setPositionNodes();
console.log(updatedNodes);

export const App = () => {
  const [data] = useState<DataType>({
    nodes: updatedNodes,
    edges: initialEdges,
  });

  const Y_STEP = 100;
  const X_STEP = 200;

  const getParentId = ({ nodes, edges }: DataType): string => {
    for (let node of nodes) {
      const id = edges.find((edge) => edge.target === node.id);
      if (!id) {
        return node.id;
      }
    }
    return "";
  };

  const getNextTarget = (id: string): EdgeType[] =>
    data.edges.filter((edge) => edge.source === id);

  const moveRight = () => {};
  const moveLeft = () => {};
  const setPositionNodes = () => {
    // Убрал : NodeType[]
    // const BLOCK_WIDTH = 150;

    let parentId = getParentId({ nodes: data.nodes, edges: data.edges });
    let xPosition = 0;
    let yPosition = 0;
    const getNodeById = {
      ...data.nodes.find((node) => node.id === parentId),
      position: { x: xPosition, y: yPosition },
    } as NodeType;
    const result = [getNodeById];
    let nextEdges = getNextTarget(parentId);
    let isStop = false;

    // while (!isStop) {
    //   const
    //   moveRight()
    //   moveLeft()
    // }
    // let countEdges = nextEdges.length;
    // let currentEdgeIndex = 0;
  };

  const onSave = (nodes: DataType) => {
    // console.log({ nodes });
    // setPositionNodes();
  };

  return (
    <div className="AppContainer">
      <Flow isEditable={true} data={data} onSave={onSave} />
    </div>
  );
};
