import G6 from "@antv/g6";
import { demo2 } from "../mock/demo2";
import { leftChild } from "../mock/kpiLeft";
import { rightChild } from "../mock/kpiRight";
import { Children } from "react";

export const dealData = () => {
  const data = {
    nodes: [
      ...demo2,
      // ...leftChild,
      // ...rightChild
    ],
    edges: [
      // {
      //   source: "1803278288395322",
      //   target: "1803013336868948",
      // },
      // {
      //   source: "1802927753101577",
      //   target: "1803013336868948",
      // },
      // {
      //   source: "1803523808856121",
      //   target: "1803013336868948",
      // },
      // {
      //   source: "1803805678563364",
      //   target: "1803013336868948",
      // },
      // {
      //   source: "1803013336868948", // 右
      //   target: "1803782147722240", // 左
      // },
      // {
      //   source: "1803013336868948",
      //   target: "1803805678563366",
      // },
    ],
  };
  return data;
};

// G6换行符处理超长文本
export const superLongTextHandle = (str, maxWidth, fontSize) => {
  let currentWidth = 0;
  let res = str;
  // 区分汉字和字母
  const pattern = new RegExp("[\u4E00-\u9FA5]+");
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      // 中文字符
      currentWidth += fontSize;
    } else {
      // 根据字体大小获取单个字母的宽度
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      res = `${str.substr(0, i)}\n${superLongTextHandle(
        str.substr(i),
        maxWidth,
        fontSize
      )}`;
    }
  });
  return [res];
};

export const dealNodeList = (list, alignType) => {
  list.map((node) => {
    dealNodeData(node, alignType);
  });
  console.log("dealNodeList", list);
  return list;
};

export const dealNodeData = (node, alignType) => {
  node.alignType = alignType;
  node.isAlign = true;
  if (alignType === "forward") {
    node.frontCollapsed = true;
  } else {
    node.backCollapsed = true;
  }
};

export const updateData = (graph, node, id, rootId, alignType, nodes) => {
  const idsName = alignType === "forward" ? "frontIds" : "backIds";
  const ids = nodes.map((item) => id);

  const edges = [];

  nodes.map((item) => {
    const edgesObj = {
      target: alignType === "forward" ? item.id : id,
      source: alignType === "forward" ? id : item.id,
    };
    edges.push(edgesObj);
    item.rootId = rootId;
    item.alignType = alignType;
  });


  graph.updateItem(node, {
    [idsName]: ids,
    children: nodes
  });

  console.log(edges, nodes);
  const oldData = {};
  const oldNodes = graph.getNodes().map((node) => node.getModel());
  const oldEdges = graph.getEdges().map((edge) => edge.getModel());
  oldData.nodes = [...oldNodes, ...nodes];
  oldData.edges = [...oldEdges, ...edges];
  graph.changeData(oldData);
  graph.render();
};
