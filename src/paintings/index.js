/* eslint-disable react-hooks/exhaustive-deps */
import React, { Children, useEffect } from "react";
import styles from "./index.module.less";
import G6 from "@antv/g6";
import {
  createNodeFromReact,
  appenAutoShapeListener,
} from "@antv/g6-react-node";
import ReactNodeCard from "./ReactNodeCard";
import { dealData } from "../utils/commons";

const colorObj = {
  OKR: "#8c55ec",
  KPI: "#3370eb",
  PROJECT: "#c24a8e",
};

const Paintings = () => {
  const ref = React.useRef(null);

  // 初始化 请求数据
  // let { data: mockData } = useRequest(() => getPaintings(id), {
  //   onSuccess: (data) => {
  //     if (data) {
  //     这里处理数据 dealData()
  //     } else {
  //       message.warning('查询信息有误！');
  //     }
  //   }
  // });

  const mockData = dealData();

  // 自定义节点、边
  const registerFn = () => {
    const startNode = createNodeFromReact(ReactNodeCard);
    startNode.getAnchorPoints = function () {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    };
    G6.registerNode("flow-rect", startNode);

    G6.registerEdge("line-arrow", {
      options: {
        style: {
          stroke: "#ccc",
        },
      },
      draw: function draw(cfg, group) {
        const nodeType = cfg.targetNode._cfg.model?.nodeType;

        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const endArrow = (cfg.style && cfg.style.endArrow) || undefined;
        const keyShape = group.addShape("path", {
          attrs: {
            path: [
              ["M", startPoint.x, startPoint.y],
              ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
              ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
              ["L", endPoint.x, endPoint.y],
            ],
            stroke: colorObj[nodeType],
            lineWidth: 1.6,
            // startArrow,
            endArrow: {
              ...endArrow,
              fill: colorObj[nodeType],
            },
          },
          className: "edge-shape-left",
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "edge-shape-left",
        });
        return keyShape;
      },
      setState(name, value, item) {
      },
    });
  };
  let graph = null;

  useEffect(() => {
    registerFn();
    const container = document.getElementById("container");
    const width = container.scrollWidth;
    const height = container.scrollHeight || 1080;

    // 默认配置
    const minimap = new G6.Minimap({
      size: [200, 100],
    });

    const defaultConfig = {
      width,
      height,
      modes: {
        default: ["drag-node", "zoom-canvas", "drag-canvas"],
      },
      fitView: true,
      animate: true,
      defaultNode: {
        type: "flow-rect",
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: "line-arrow",
        style: {
          // stroke: "#a23df9",
          startArrow: {
            path: "M 0,0 L 12,6 L 9,0 L 12,-6 Z",
          },
          endArrow: {
            path: "M 0,0 L 12,6 L 9,0 L 12,-6 Z", // 箭头
          },
        },
      },
      layout: {
        type: "dagre",
        rankdir: "RL",
        // align: "UL",
        // nodesep: 80,
        ranksep: 180,
        // nodesepFunc: (e) => {
        //   if (e.list instanceof Array && e.list.length > 0) {
        //     return 50 + 50 * e.list.length
        //   }
        //   return 50;
        // },
      },
    };

    // if (!mockData || !mockData?.id) {
    //   return;
    // }

    graph = new G6.Graph({
      container: "container",
      ...defaultConfig,
      padding: [20, 50],
      defaultLevel: 3,
      defaultZoom: 1,
      plugins: [minimap],
      fitView: true,
    });
    graph.data(mockData);
    graph.render();
    graph.fitView();
    appenAutoShapeListener(graph);

    return () => {
      graph.destroy();
    };
  }, [mockData]);

  return (
    <div className={styles.paintings}>
      <div id="container" ref={ref}></div>
    </div>
  );
};

export default Paintings;
