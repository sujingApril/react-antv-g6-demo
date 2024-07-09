import G6 from "@antv/g6";
import { demo2 } from "../mock/demo2";

export const dealData = () => {
  const nodes = dealNodeList(demo2);
  const data = {
    nodes: [
      ...nodes,
    ],
    edges: [
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
  return res;
};

export const dealNodeList = (list, alignType) => {
  list.map((node) => {
    dealNodeData(node, alignType);
  });
  return list;
};

// 处理根节点
export const dealNodeData = (node, alignType) => {
  // node.alignType = alignType;
  node.isAlign = true;
  node.isRoot = true;
  if (alignType === "forward") {
    node.frontCollapsed = true;
    node.frontIds = [];
  } else if(alignType === "backward") {
    node.backCollapsed = true;
    node.backIds = [];
  }else{
    node.frontCollapsed = true;
    node.frontIds = [];
    node.backCollapsed = true;
    node.backIds = [];
  }
};

// 添加新节点
export const updateData = (
  graph,
  node,
  id,
  rootId,
  alignType,
  nodes,
  collapseName
) => {
  const idsName = alignType === "forward" ? "frontIds" : "backIds";
  const ids = nodes.map((item) => item.id);

  const edges = [];

  nodes.map((item) => {
    const edgesObj = {
      target: alignType === "forward" ? item.id : id,
      source: alignType === "forward" ? id : item.id,
    };
    edges.push(edgesObj);
    // 新节点新增字段
    item.rootId = rootId;
    item.alignType = alignType;
    item.collapsedIcon = true;
  });

  // 当前节点新增
  graph.updateItem(node, {
    [idsName]: ids,
    [collapseName]: !node._cfg.model[collapseName],
  });

  const oldData = {};
  const oldNodes = graph.getNodes().map((node) => node.getModel());
  const oldEdges = graph.getEdges().map((edge) => edge.getModel());
  oldData.nodes = [...oldNodes, ...nodes];
  oldData.edges = [...oldEdges, ...edges];
  graph.changeData(oldData);
  graph.layout();
};

export const getChildNodes = (alignType, curNode, graph) => {
  const idsName = alignType === "forward" ? "frontIds" : "backIds";
  // let ids = [];
  let resultNodes = [];

  const traverse = (inNode) => {
    let nodes = [];
    if (inNode?.[idsName]) {
      // ids = ids.concat(inNode?.[idsName]);
      nodes = graph.findAll("node", (node) => {
        return inNode[idsName].indexOf(node.getModel().id) >= 0;
      });
      resultNodes = resultNodes.concat(nodes);
    }

    nodes &&
      nodes.length > 0 &&
      nodes.map((node) => {
        traverse(node.getModel());
      });
  };

  traverse(curNode);

  return resultNodes;
};

export const getBoxHeight = ( node, collapsed) => {
  const nodeModel = node.getModel();

  let contentLineNum = nodeModel?.content
    ? superLongTextHandle(nodeModel?.content, 300, 14).split("\n")?.length
    : 1;

  if (!collapsed) {
    let contentLineNum2 = 0;
    nodeModel?.list?.map((item) => {
      const workItemContentNum = item?.work_item_content
        ? superLongTextHandle(item?.work_item_content, 290, 14).split("\n")
            ?.length
        : 1;
        contentLineNum2 = contentLineNum2 + workItemContentNum;
    });
    const height = 118 + contentLineNum * 16 + contentLineNum2 * 14 + nodeModel?.list?.length * 62;

    return height;
  } else {
    return 118 + contentLineNum * 16;
  }
};
