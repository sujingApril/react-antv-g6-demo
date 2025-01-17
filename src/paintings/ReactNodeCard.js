import React from "react";
import G6 from "@antv/g6";
import { Rect, Text, Image, Group, Circle } from "@antv/g6-react-node";
import { dealNodeList, superLongTextHandle, updateData } from "../utils/commons";
import { leftChild } from "../mock/kpiLeft";
import { rightChild } from "../mock/kpiRight";

const KRlist = ({ data, index }) => {
  const {
    nodeType,
    work_item_content,
    basic_value,
    ceiling_value,
    lowest_value,
    director,
    synergies,
  } = data;

  let listType = "";
  if (nodeType === "O") {
    listType = "KR";
  } else if (nodeType === "KPI") {
    listType = "指标";
  }

  return (
    <Rect key={index}>
      <Rect
        style={{
          height: 1,
          width: 340,
          fill: "#eee",
          margin: [10, 0],
          cursor: "pointer",
          flexDirection: "row",
          alignSelf: "center",
        }}
      ></Rect>
      <Rect style={{ width: "auto", flexDirection: "row", padding: [4, 12] }}>
        <Rect
          style={{
            fill: colorObj[data?.nodeType]?.one,
            radius: [2],
            height: 20,
            width: "auto",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fill: colorObj[data?.nodeType]?.four,
              margin: [6, 6],
              fontSize: 10,
            }}
          >
            {listType}
            {index + 1}
          </Text>
        </Rect>
        <Text
          style={{
            fill: "#000",
            margin: [4, 10],
            fontSize: 14,
            fontWeight: "bold",
            width: 100,
            minWidth: 200,
          }}
        >
          {work_item_content
            ? superLongTextHandle(work_item_content, 290, 14)[0]
            : "--"}
        </Text>
      </Rect>
      {listType === "指标" && (
        <Rect
          style={{
            width: "auto",
            flexDirection: "row",
            margin: [6, 0, 0, 60],
          }}
        >
          <Text
            style={{
              fill: colorObj[data?.nodeType]?.six,
              margin: [4, 10],
              fontSize: 12,
              fontWeight: "bolder",
            }}
          >
            挑战：{ceiling_value || '--'}
          </Text>
          <Text
            style={{
              fill: colorObj[data?.nodeType]?.four,
              margin: [4, 10],
              fontSize: 12,
            }}
          >
            基准：{basic_value || '--'}
          </Text>

          <Text
            style={{
              fill: "#d14642", // colorObj[data?.nodeType]?.two,
              margin: [4, 10],
              fontSize: 12,
              fontWeight: "bolder",
            }}
          >
            底线：{lowest_value || '--'}
          </Text>
        </Rect>
      )}
      {listType === "KR" && (
        <Rect
          style={{
            width: "auto",
            flexDirection: "row",
            margin: [6, 20, 6, 50],
          }}
        >
          <Rect
            style={{
              fill: colorObj[data?.nodeType]?.one,
              width: "auto",
              padding: [6, 10],
              margin: [0, 10, 0, 0],
              radius: [10],
              flexDirection: "row",
            }}
          >
            <Text
              key={index}
              style={{
                fill: colorObj[data?.nodeType]?.four,
                padding: [6, 10],
                fontSize: 12,
              }}
            >
              @{director?.name}
            </Text>
          </Rect>
          {synergies?.map((item, index) => (
            <Rect
              style={{
                fill: "#eee", //colorObj[data?.nodeType]?.one,
                width: "auto",
                padding: [6, 10],
                margin: [0, 10, 0, 0],
                radius: [10],
              }}
            >
              <Text
                key={index}
                style={{
                  fill: "#999", // colorObj[data?.nodeType]?.four,
                  padding: [6, 10],
                  fontSize: 12,
                }}
              >
                {item?.name}
              </Text>
            </Rect>
          ))}
        </Rect>
      )}
    </Rect>
  );
};

const colorObj = {
  O: {
    one: "#dbc8fd",
    two: "#c5a3ff",
    three: "#a575fa",
    four: "#8c55ec",
    five: "#6c39c6",
    six: "#5529a3",
  },
  KR: {
    one: "#dbc8fd",
    two: "#c5a3ff",
    three: "#a575fa",
    four: "#8c55ec",
    five: "#6c39c6",
    six: "#5529a3",
  },
  KPI: {
    one: "#bdd2ff",
    two: "#8fb4ff",
    three: "#4c88ff",
    four: "#3370eb",
    five: "#2655b6",
    six: "#194294",
  },
  指标: {
    one: "#bdd2ff",
    two: "#8fb4ff",
    three: "#4c88ff",
    four: "#3370eb",
    five: "#2655b6",
    six: "#194294",
  },
  项目: {
    one: "#ffc2e5",
    two: "#fc94cf",
    three: "#ed77ba",
    four: "#c24a8e",
    five: "#94386c",
    six: "#782b57",
  },
};

const ReactNodeCard = ({ cfg }, mockData) => {
  let {
    id,
    userAvatar,
    userName,
    nodeType,
    content,
    list,
    // project:{
    //     name,
    // },

    isRoot,
    rootId,
    frontIds, // 根节点 前展开按钮
    backIds, // 根节点 后展开按钮
    frontCollapsed, // 根节点 前展开按钮
    backCollapsed, // 根节点 后展开按钮

    isAlign = true, // 是否对齐
    alignType, // 对齐方式，forward / backward
    collapsed, // 自带 展开收起

    collapsedIcon = true, // 子节点 展开按钮
    listCollapsed, // 展开/收起 字段
    children = [],
    depth,
    visible,
  } = cfg;

  console.log(cfg);

  nodeType =
    nodeType === "OKR" ? "O" : nodeType === "PROJECT" ? "项目" : nodeType;

  const collapseClick = (event, node, shape, graph, direction) => {
    // let collapsedIcon=node._cfg.model.collapsedIcon
    // console.log(node)
    const nodeModel = node._cfg.model;
    let data = nodeModel?.children || [];
    if (collapsedIcon && data?.length === 0) {
      if (direction === "forward") {
        data = dealNodeList(leftChild, direction);
        graph.addChild(data, "node");
      } else {
        // console.log(leftChild)
        data = dealNodeList(rightChild, direction);
        graph.addChild(data, "node");
      }
    }
    graph.updateItem(node, {
      collapsedIcon: !collapsedIcon,
      collapsed: !collapsedIcon,
      children: data,
    });

    // nodeModel.collapsedIcon = !collapsedIcon;
    nodeModel.children = data;
    graph.layout();
  };

  const collapseFront = (event, node, shape, graph) => {
    const nodeModel = node._cfg.model;

    if(!frontIds || (frontIds && frontIds.length <= 0) ){
      updateData(graph, node, id, id, alignType="forward", leftChild);
    }
    graph.updateItem(node, {
      frontCollapsed: !frontCollapsed,
    });
 
    nodeModel.frontCollapsed = !frontCollapsed;
    const items = graph.findAll("node", (node) => {
      return node.get("model").alignType === "forward" && node.get("model").rootId === id;
    });

    items.map((item) => {
      const model = item._cfg.model;
      if (model.id !== nodeModel.id) {
        if (!frontCollapsed) { 
          graph.hideItem(item, true);
        } else {
          graph.showItem(item, true);
        }
      }
    });
    // 根节点我直接给先隐藏了因为有左右展开
    graph.layout();
  };

  const collapseBack = (event, node, shape, graph) => {

    const nodeModel = node._cfg.model;
    if(!backIds || (backIds && backIds.length <= 0) ){
      updateData(graph, node, id, id, alignType="backward", rightChild);
    }
    nodeModel.backCollapsed = !backCollapsed;
    graph.updateItem(node, {
      backCollapsed: !backCollapsed,
    });

    const items = graph.findAll("node", (node) => {
      return node.get("model").alignType === "backward" && node.get("model").rootId === id;
    });

    items.map((item) => {
      const model = item._cfg.model;
      if (model.id !== nodeModel.id) {
        if (!backCollapsed) {
          graph.hideItem(item, true);
        } else {
          graph.showItem(item, true);
        }
      }
    });
    graph.layout();
  };

  return (
    <Group draggable zIndex={1}>
      <Rect
        style={{
          width: 400,
          height: "auto",
          fill: "#fff",
          // fill: 'transparent',
          stroke: colorObj[nodeType]?.four,
          shadowColor: "#eee",
          shadowBlur: 30,
          radius: [8],
          justifyContent: "center",
          padding: [24, 16],
        }}
        draggable
      >
        <Rect style={{ width: "auto", flexDirection: "row", padding: [4, 12] }}>
          <Image
            style={{
              img:
                userAvatar?.image?.large ||
                "https://s3-imfile.feishucdn.com/static-resource/v1/v3_007g_41528857-3b2e-466c-b764-0c8f8b8c469g~?image_size=noop&cut_type=&quality=&format=image&sticker_format=.webp",
              width: 20,
              height: 20,
              radius: [10],
            }}
          />
          <Text
            style={{
              fill: "#000",
              margin: [4, 10],
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {userName}
          </Text>
          {!isAlign && (
            <Rect
              style={{
                height: 22,
                width: 54,
                fill: "#ddd",
                radius: [4],
                flexDirection: "row",
                padding: [4, 6],
              }}
            >
              <Text
                style={{
                  margin: [2, 4],
                  fill: "#666",
                  fontSize: 12,
                }}
              >
                未对齐
              </Text>
            </Rect>
          )}
        </Rect>
        {/* 未对齐 */}
        {/* {!isAlign && (
          <Rect style={{ textAlign: "center", padding: [20] }}>
            <Text
              style={{
                width: 0,
                fill: "#ccc",
                fontSize: 16,
                margin: [20, "auto"],
              }}
            >
              还没指定OKR
            </Text>
            <Rect
              style={{
                width: "auto",
                display: "block",
                fill: colorObj[nodeType]?.one,
                radius: [4],
                flexDirection: "row",
                margin: "auto",
                padding: [4, 10],
              }}
            >
              <Text
                style={{
                  margin: [4, 10],
                  fill: colorObj[nodeType]?.four,
                  fontSize: 16,
                }}
              >
                提醒他
              </Text>
            </Rect>
          </Rect>
        )} */}
        {/* 卡片 */}
        <Rect>
          <Rect
            style={{
              width: "auto",
              flexDirection: "row",
              padding: [4, 12],
              margin: [10, 0, 0, 0],
            }}
          >
            <Rect
              style={{
                fill: colorObj[nodeType]?.four,
                radius: [10],
                height: 20,
                width: "auto",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fill: "#fff",
                  margin: [6, 6],
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {nodeType ? nodeType : "--"}
              </Text>
            </Rect>
            <Text
              style={{
                fill: "#000",
                margin: [4, 10],
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {content ? superLongTextHandle(content, 300, 14)[0] : "--"}
            </Text>
          </Rect>
          <Rect
            style={{ width: "auto", flexDirection: "row", margin: [4, 40] }}
          >
            {list?.length > 0 && (
              <Text
                style={{
                  fill: colorObj[nodeType]?.four,
                  fontSize: 12,
                  margin: [0, 0, 0, 270],
                }}
                onClick={(event, node, shape, graph) => {
                  const nodeModel = node._cfg.model;
                  nodeModel.listCollapsed = !listCollapsed;

                  let height = 80;
                  if(!listCollapsed){
                    if (
                      nodeModel.list instanceof Array &&
                      nodeModel.list.length > 0
                    ) {
                      height = 70 + 70 * nodeModel.list.length;
                    }
                  }
                  graph.updateItem(node, {
                    listCollapsed: !listCollapsed,
                    height: height,
                  });
                  graph.refresh();
                  graph.layout();
                }}
              >
                {!listCollapsed ? "展开" : "收起"}
              </Text>
            )}
            {/* </Rect> */}
          </Rect>
        </Rect>
        {/* 是否显示list */}
        {listCollapsed && list?.length > 0 && (
          <Rect>
            {list &&
              list?.map((item, index) => (
                <KRlist
                  data={{ ...item, nodeType }}
                  index={index}
                  key={index}
                />
              ))}
          </Rect>
        )}

        {/* 根节点展开收起按钮 */}
        {isRoot && (
          <Rect>
            <Rect
              style={{
                position: "absolute",
                x: 0,
                y: 68,
                width: 16,
                height: 16,
                stroke: colorObj[nodeType]?.four,
                cursor: "pointer",
                fill: "#fff",
              }}
              onClick={collapseFront}
            >
              <Text
                style={{
                  position: "absolute",
                  x: 8,
                  y: 60 + 17,
                  fill: colorObj[nodeType]?.four,
                  cursor: "pointer",
                  fontSize: 12,
                  textAlign: "center",
                  textBaseline: "middle",
                }}
                onClick={collapseFront}
              >
                {frontCollapsed ? (frontIds?.length || 0) + ""
                  : "-"}
              </Text>
            </Rect>
            <Rect
              style={{
                position: "absolute",
                x: 384,
                y: 68,
                width: 16,
                height: 16,
                stroke: colorObj[nodeType]?.four,
                cursor: "pointer",
                fill: "#fff",
              }}
              onClick={collapseBack}
            >
              <Text
                style={{
                  position: "absolute",
                  x: 392,
                  y: 60 + 17,
                  // x:cfg.endPoint.x,
                  // y:cfg.endPoint.y,
                  fill: colorObj[nodeType]?.four,
                  cursor: "pointer",
                  fontSize: 12,
                  textAlign: "center",
                  textBaseline: "middle",
                }}
                onClick={collapseBack}
              >
                {backCollapsed ? (backIds?.length || 0) + "" : "-"}
              </Text>
            </Rect>
          </Rect>
        )}

        {/* 子节点展开收起按钮 */}
        {!isRoot &&
          (alignType === "forward" ? (
            <Rect
              style={{
                position: "absolute",
                x: 0,
                y: 68,
                width: 16,
                height: 16,
                stroke: colorObj[nodeType]?.four,
                cursor: "pointer",
                fill: "#fff",
                name: "collapsed-shape",
              }}
              onClick={(event, node, shape, graph) => {
                collapseClick(event, node, shape, graph, alignType);
              }}
            >
              <Text
                style={{
                  position: "absolute",
                  x: 8,
                  y: 60 + 17,
                  fill: colorObj[nodeType]?.four,
                  fontSize: 12,
                  textAlign: "center",
                  textBaseline: "middle",
                  cursor: "pointer",
                }}
                onClick={(event, node, shape, graph) => {
                  collapseClick(event, node, shape, graph, alignType);
                }}
              >
                {collapsedIcon ? (children.length || 0) + "" : "-"}
              </Text>
            </Rect>
          ) : (
            <Rect
              style={{
                position: "absolute",
                x: 384,
                y: 68,
                width: 16,
                height: 16,
                stroke: colorObj[nodeType]?.four,
                cursor: "pointer",
                fill: "#fff",
              }}
              name="collapsed-shape"
              onClick={(event, node, shape, graph) => {
                collapseClick(event, node, shape, graph, alignType);
              }}
            >
              <Text
                style={{
                  position: "absolute",
                  x: 392,
                  y: 60 + 17,
                  // x:cfg.endPoint.x,
                  // y:cfg.endPoint.y,
                  fill: colorObj[nodeType]?.four,
                  cursor: "pointer",
                  fontSize: 12,
                  textAlign: "center",
                  textBaseline: "middle",
                }}
                onClick={(event, node, shape, graph) => {
                  collapseClick(event, node, shape, graph, alignType);
                }}
              >
                {collapsedIcon ? (children.length || 0) + "" : "-"}
              </Text>
            </Rect>
          ))}
      </Rect>
    </Group>
  );
};

export default ReactNodeCard;
