/* eslint-disable react-hooks/exhaustive-deps */
import React, { Children, useEffect } from "react";
import styles from "./index.module.less";
import G6 from "@antv/g6";
import {
  createNodeFromReact,
  appenAutoShapeListener,
} from "@antv/g6-react-node";
import { baseData, mockdata, proData } from "../mock/demo1";
import ReactNodeCard from "./ReactNodeCard";
import { demo2 } from "../mock/demo2";
// import { getPaintings } from '../api/paintings';

const colorObj = {
  'OKR':'#8c55ec',
  'KPI':'#3370eb',
  'PROJECT':'#c24a8e',
}

const Paintings = () => {
  const ref = React.useRef(null);

  // let { data: mockData } = useRequest(() => getPaintings(id), {
  //   onSuccess: (data) => {
  //     if (data) {

  //     } else {
  //       message.warning('查询信息有误！');
  //     }
  //   }
  // });

  const mockData = {
    id: "1803013336868947",
    nodeType: "KPI",
    userName: "司维坤",
    userAvatar: {
      image: {
        large:
          "https://s3-imfile.feishucdn.com/static-resource/v1/v3_007g_41528857-3b2e-466c-b764-0c8f8b8c469g~?image_size=noop&cut_type=&quality=&format=image&sticker_format=.webp",
      },
    },
    content:
      "在本季度内完成或超额完成既定的销售额目标，包括堂食、外卖和线上渠道的销售总额。",
    list: [
      {
        _id: "1803015220386891",
        basic_value: "8",
        ceiling_value: "10",
        lowest_value: "5",
        work_item_content: "每月至少开发X个新客户。",
      },
    ],
    children: demo2,
  };

  // 自定义节点、边
  const registerFn = () => {
    /**
     * 自定义节点
     */

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
        console.log(cfg, group)

        const nodeType = cfg.targetNode._cfg.model?.nodeType;

        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        const stroke =
          (cfg.style && cfg.style.stroke) || this.options.style.stroke;
        const startArrow = (cfg.style && cfg.style.startArrow) || undefined;
        const endArrow = (cfg.style && cfg.style.endArrow) || undefined;

        if (cfg.targetNode._cfg.model.alignType === "backward") {
          const keyShape = group.addShape("path", {
            attrs: {
              path: [
                ["M", startPoint.x, startPoint.y],
                ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
                ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
                ["L", endPoint.x, endPoint.y],
              ],
              stroke: colorObj[nodeType],
              lineWidth: 1.6,
              startArrow:{
                ...startArrow,
                fill: colorObj[nodeType]
              },
              // endArrow,
            },
            className: "edge-shape-right",
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: "edge-shape-right",
          });
          return keyShape;
        } else {
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
              endArrow:{
                ...endArrow,
                fill: colorObj[nodeType]
              },
            },
            className: "edge-shape-left",
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: "edge-shape-left",
          });
          return keyShape;
        }
      },
      setState(name, value, item) {
        // if (name === 'collapsed') {
        //   const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon');
        //   const icon = value ? G6.Marker.expand : G6.Marker.collapse;
        //   marker.attr('symbol', icon);
        // }
      },
    });
  };
  let graph = null;

  useEffect(() => {
    registerFn();
    const container = document.getElementById("container");
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;

    // 默认配置
    const minimap = new G6.Minimap({
      size: [200, 100],
    })

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
            // fill: "#a23df9",
          },
          endArrow: {
            path: "M 0,0 L 12,6 L 9,0 L 12,-6 Z", // 箭头
            // fill: "#a23df9",
          },
        },
      },
      layout: {
        type: "mindmap",
        direction: "H",
        // type: 'compactBox',
        // direction: 'LR',
        dropCap: true,
        // indent: 500,
        getVGap: (e) => {
          return 80;
        },
        // getHeight: (e) => {
          // if (e.list instanceof Array && e.list.length > 0) {
          //   return 60 + 60 * e.list.length
          // }
        //   return 10;
        // },
        getWidth: () => {
          return 500;
        },
        getSide: (d) => {
          if (d.data.alignType === "forward") {
            return "left";
          }
          return "right";
        },
      },
    };

    // if (!mockData || !mockData?.id) {
    //   return;
    // }

    graph = new G6.TreeGraph({
      container: "container",
      ...defaultConfig,
      padding: [20, 50],
      defaultLevel: 3,
      defaultZoom: 0.5,
      modes: { default: ["zoom-canvas", "drag-canvas"] },
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
