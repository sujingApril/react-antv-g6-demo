/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef } from "react";
import G6 from "@antv/g6";
import { demo2 } from "../mock/demo2";
import {
  dealData,
  superLongTextHandle,
  superLongTextHandle2,
} from "../utils/commons";
import {
  createNodeFromReact,
  appenAutoShapeListener,
} from "@antv/g6-react-node";
import ReactNodeCard from "../paintings/ReactNodeCard";
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

const getNodeConfig = (node) => {
  if (node.nodeError) {
    return {
      basicColor: "#F5222D",
      fontColor: "#FFF",
      borderColor: "#F5222D",
      bgColor: "#E66A6C",
    };
  }
  let config = {
    basicColor: "#5B8FF9",
    fontColor: "#5B8FF9",
    borderColor: "#5B8FF9",
    bgColor: "#C6E5FF",
  };
  switch (node.type) {
    case "root": {
      config = {
        basicColor: "#E3E6E8",
        fontColor: "rgba(0,0,0,0.85)",
        borderColor: "#E3E6E8",
        bgColor: "#5b8ff9",
      };
      break;
    }
    default:
      break;
  }
  return config;
};

const nodeBasicMethod = {
  createNodeBox: (group, config, w, h, isRoot) => {
    /* 最外面的大矩形 */
    const container = group.addShape("rect", {
      attrs: {
        x: 0,
        y: 0,
        width: w,
        height: h,
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "big-rect-shape",
    });
    if (!isRoot) {
      /* 左边的小圆点 */
      group.addShape("circle", {
        attrs: {
          x: 3,
          y: h / 2,
          r: 6,
          fill: config.basicColor,
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "left-dot-shape",
      });
    }
    /* 矩形 */
    group.addShape("rect", {
      attrs: {
        x: 3,
        y: 0,
        width: w - 19,
        height: h,
        fill: config.bgColor,
        stroke: config.borderColor,
        radius: 2,
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "rect-shape",
    });

    /* 左边的粗线 */
    group.addShape("rect", {
      attrs: {
        x: 3,
        y: 0,
        width: 3,
        height: h,
        fill: config.basicColor,
        radius: 1.5,
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "left-border-shape",
    });
    return container;
  },
  /* 生成树上的 marker */
  createNodeMarker: (group, collapsed, x, y) => {
    group.addShape("circle", {
      attrs: {
        x,
        y,
        r: 13,
        fill: "rgba(47, 84, 235, 0.05)",
        opacity: 0,
        zIndex: -2,
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "collapse-icon-bg",
    });
    // group.addShape('marker', {
    //   attrs: {
    //     x,
    //     y,
    //     r: 7,
    //     symbol: collapsed ? EXPAND_ICON : COLLAPSE_ICON,
    //     stroke: 'rgba(0,0,0,0.25)',
    //     fill: 'rgba(0,0,0,0)',
    //     lineWidth: 1,
    //     cursor: 'pointer',
    //   },
    //   // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //   name: 'collapse-icon',
    // });
  },
  afterDraw: (cfg, group) => {
    /* 操作 marker 的背景色显示隐藏 */
    const icon = group.find(
      (element) => element.get("name") === "collapse-icon"
    );
    if (icon) {
      const bg = group.find(
        (element) => element.get("name") === "collapse-icon-bg"
      );
      icon.on("mouseenter", () => {
        bg.attr("opacity", 1);
        // graph.get('canvas').draw();
      });
      icon.on("mouseleave", () => {
        bg.attr("opacity", 0);
        // graph.get('canvas').draw();
      });
    }
    /* ip 显示 */
    const ipBox = group.find((element) => element.get("name") === "ip-box");
    if (ipBox) {
      /* ip 复制的几个元素 */
      const ipLine = group.find(
        (element) => element.get("name") === "ip-cp-line"
      );
      const ipBG = group.find((element) => element.get("name") === "ip-cp-bg");
      const ipIcon = group.find(
        (element) => element.get("name") === "ip-cp-icon"
      );
      const ipCPBox = group.find(
        (element) => element.get("name") === "ip-cp-box"
      );

      const onMouseEnter = () => {
        ipLine.attr("opacity", 1);
        ipBG.attr("opacity", 1);
        ipIcon.attr("opacity", 1);
        // graph.get('canvas').draw();/
      };
      const onMouseLeave = () => {
        ipLine.attr("opacity", 0);
        ipBG.attr("opacity", 0);
        ipIcon.attr("opacity", 0);
        // graph.get('canvas').draw();
      };
      ipBox.on("mouseenter", () => {
        onMouseEnter();
      });
      ipBox.on("mouseleave", () => {
        onMouseLeave();
      });
      ipCPBox.on("mouseenter", () => {
        onMouseEnter();
      });
      ipCPBox.on("mouseleave", () => {
        onMouseLeave();
      });
      ipCPBox.on("click", () => {});
    }
  },
  setState: (name, value, item) => {
    const hasOpacityClass = [
      "ip-cp-line",
      "ip-cp-bg",
      "ip-cp-icon",
      "ip-cp-box",
      "ip-box",
      "collapse-icon-bg",
    ];
    const group = item.getContainer();
    const childrens = group.get("children");
    // graph.setAutoPaint(false);
    if (name === "emptiness") {
      if (value) {
        childrens.forEach((shape) => {
          if (hasOpacityClass.indexOf(shape.get("name")) > -1) {
            return;
          }
          shape.attr("opacity", 0.4);
        });
      } else {
        childrens.forEach((shape) => {
          if (hasOpacityClass.indexOf(shape.get("name")) > -1) {
            return;
          }
          shape.attr("opacity", 1);
        });
      }
    }
    // graph.setAutoPaint(true);
  },
};

const Demo2 = () => {
  const containerRef = useRef(null);

  const data = dealData();

  const registerFn = () => {
    // G6.registerNode("card-node", {
    //   draw: (cfg, group) => {
    //     let {
    //       nodeType,
    //       userName,
    //       userAvatar: {
    //         image: { large: avatar },
    //       },
    //       content,
    //       list,
    //       objectType,
    //       collapsed,
    //       listCollapsed,
    //     } = cfg;

    //     console.log(cfg);

    //     // const {
    //     //   work_item_content,
    //     //   basic_value,
    //     //   ceiling_value,
    //     //   lowest_value,
    //     //   director: {
    //     //     avatar: {
    //     //       image: { large: directorAvatar },
    //     //     },
    //     //     name,
    //     //   },
    //     //   synergies,
    //     // } = list;

    //     let listType = "";
    //     if (nodeType === "OKR") {
    //       nodeType = "O";
    //       listType = "KR";
    //     } else if (nodeType === "KPI") {
    //       listType = "指标";
    //     } else {
    //       nodeType = "项目";
    //     }

    //     console.log(111, cfg, nodeType);

    //     const rectConfig = {
    //       width: 400,
    //       height: 240,
    //       lineWidth: 1,
    //       fontSize: 12,
    //       fill: "#f0f",
    //       radius: 8,
    //       stroke: "#666",
    //       opacity: 1,
    //     };

    //     const nodeOrigin = {
    //       x: -rectConfig.width / 2,
    //       y: -rectConfig.height / 2,
    //     };

    //     const textConfig = {
    //       textAlign: "left",
    //       textBaseline: "bottom",
    //     };

    //     const config = getNodeConfig(cfg);
    //     const isRoot = cfg.dataType === "root";
    //     const nodeError = cfg.nodeError;
    //     /* the biggest rect */
    //     const container = nodeBasicMethod.createNodeBox(
    //       group,
    //       config,
    //       400,
    //       100,
    //       isRoot
    //     );

    //     // 头像
    //     group.addShape("image", {
    //       attrs: {
    //         x: 20,
    //         y: 20,
    //         width: 20,
    //         height: 20,
    //         radius: 4,
    //         img:
    //           avatar ||
    //           "https://s3-imfile.feishucdn.com/static-resource/v1/v3_007g_41528857-3b2e-466c-b764-0c8f8b8c469g~?image_size=noop&cut_type=&quality=&format=image&sticker_format=.webp",
    //       },
    //       name: "avatar-image-shape",
    //     });

    //     // 姓名
    //     const userNameArr = superLongTextHandle(userName, 360, 16);
    //     group.addShape("text", {
    //       attrs: {
    //         ...textConfig,
    //         x: 54,
    //         y: 40,
    //         text: userNameArr[0],
    //         fontSize: 16,
    //         fill: "#333",
    //       },
    //       name: "username-text-shape",
    //     });

    //     // 类型
    //     group.addShape("rect", {
    //       attrs: {
    //         x: 20,
    //         y: 56,
    //         width: 30,
    //         height: 20,
    //         radius: 10,
    //         fill: colorObj[nodeType].four,
    //       },
    //       name: "nodetype-rect-shape",
    //     });
    //     group.addShape("text", {
    //       attrs: {
    //         ...textConfig,
    //         x: 36,
    //         y: 72,
    //         text: nodeType + "1" || "--",
    //         fontSize: 10,
    //         fontWeight: "bold",
    //         textAlign: "center",
    //         fill: "#fff",
    //       },
    //       name: "nodetype-text-shape",
    //     });

    //     // 内容
    //     const data = superLongTextHandle(content, 314, 16);
    //     const length = data[0]?.split("\n").length;
    //     const textHeight = 16 * length;
    //     group.addShape("text", {
    //       attrs: {
    //         ...textConfig,
    //         x: 60,
    //         y: 60,
    //         text: data[0],
    //         fontSize: 16,
    //         fill: "#333",
    //         textBaseline: "top",
    //       },
    //       name: "content-text-shape",
    //     });

    //     // 展开收起按钮
    //     list && list.length > 0 && 
    //       group.addShape("text", {
    //         attrs: {
    //           ...textConfig,
    //           x: 36,
    //           y: 86 + textHeight,
    //           width: "100%",
    //           text: listCollapsed ? "收起" : "收起",
    //           fontSize: 12,
    //           textAlign: "right",
    //           fill: colorObj[nodeType].two,
    //           cursor: "pointer",
    //         },
    //         name: "listcollapsed-text-shape",
    //       });

    //     if (list && list.length > 0) {
    //       list.map((item) =>{
    //           group.addShape("rect", {
    //             attrs: {
    //               x: 20,
    //               y: 100 + textHeight,
    //               width: 344,
    //               height: 1,
    //               radius: 1,
    //               fill: colorObj[nodeType].one,
    //             },
    //             name: "line-rect-shape",
    //           });
    //           // 类型
    //         group.addShape("rect", {
    //           attrs: {
    //             x: 20,
    //             y: 116 + textHeight,
    //             width: 30,
    //             height: 20,
    //             radius: 4,
    //             fill: colorObj[nodeType].one,
    //           },
    //           name: "nodetype-rect-shape",
    //         });
    //         group.addShape("text", {
    //           attrs: {
    //             ...textConfig,
    //             x: 36,
    //             y: 132 + textHeight,
    //             text: listType,
    //             fontSize: 10,
    //             textAlign: "center",
    //             fill: colorObj[nodeType].four,
    //           },
    //           name: "nodetype-text-shape",
    //         });

    //         // 内容
    //         const data = superLongTextHandle(item.work_item_content, 314, 16);
    //         const listTextLength = data[0]?.split("\n").length;
    //         const listTextHeight = 16 * listTextLength;
    //         group.addShape("text", {
    //           attrs: {
    //             ...textConfig,
    //             x: 60,
    //             y: 132 + textHeight,
    //             text: data[0],
    //             fontSize: 16,
    //             fill: "#333",
    //             // textBaseline: "top",
    //           },
    //           name: "list-content-text-shape",
    //         });
    //       })
    //     }

    //     if (cfg.ip) {
    //       /* ip start */
    //       /* ipBox */
    //       const ipRect = group.addShape("rect", {
    //         attrs: {
    //           fill: nodeError ? null : "#FFF",
    //           stroke: nodeError ? "rgba(255,255,255,0.65)" : null,
    //           radius: 2,
    //           cursor: "pointer",
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "ip-container-shape",
    //       });

    //       /* ip */
    //       const ipText = group.addShape("text", {
    //         attrs: {
    //           text: cfg.ip,
    //           x: 0,
    //           y: 19,
    //           fontSize: 12,
    //           textAlign: "left",
    //           textBaseline: "middle",
    //           fill: nodeError ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.65)",
    //           cursor: "pointer",
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "ip-text-shape",
    //       });

    //       const ipBBox = ipText.getBBox();
    //       /* the distance from the IP to the right is 12px */
    //       ipText.attr({
    //         x: 224 - 12 - ipBBox.width,
    //       });
    //       /* ipBox */
    //       ipRect.attr({
    //         x: 224 - 12 - ipBBox.width - 4,
    //         y: ipBBox.minY - 5,
    //         width: ipBBox.width + 8,
    //         height: ipBBox.height + 10,
    //       });

    //       /* a transparent shape on the IP for click listener */
    //       group.addShape("rect", {
    //         attrs: {
    //           stroke: "",
    //           cursor: "pointer",
    //           x: 224 - 12 - ipBBox.width - 4,
    //           y: ipBBox.minY - 5,
    //           width: ipBBox.width + 8,
    //           height: ipBBox.height + 10,
    //           fill: "#fff",
    //           opacity: 0,
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "ip-box",
    //       });

    //       /* copyIpLine */
    //       group.addShape("rect", {
    //         attrs: {
    //           x: 194,
    //           y: 7,
    //           width: 1,
    //           height: 24,
    //           fill: "#E3E6E8",
    //           opacity: 0,
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "ip-cp-line",
    //       });
    //       /* copyIpBG */
    //       group.addShape("rect", {
    //         attrs: {
    //           x: 195,
    //           y: 8,
    //           width: 22,
    //           height: 22,
    //           fill: "#FFF",
    //           cursor: "pointer",
    //           opacity: 0,
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "ip-cp-bg",
    //       });
    //       /* copyIpIcon */
    //       group.addShape("image", {
    //         attrs: {
    //           x: 200,
    //           y: 13,
    //           height: 12,
    //           width: 10,
    //           img: "https://os.alipayobjects.com/rmsportal/DFhnQEhHyPjSGYW.png",
    //           cursor: "pointer",
    //           opacity: 0,
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "ip-cp-icon",
    //       });
    //       /* a transparent rect on the icon area for click listener */
    //       group.addShape("rect", {
    //         attrs: {
    //           x: 195,
    //           y: 8,
    //           width: 22,
    //           height: 22,
    //           fill: "#FFF",
    //           cursor: "pointer",
    //           opacity: 0,
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "ip-cp-box",
    //         tooltip: "Copy the IP",
    //       });

    //       /* ip end */
    //     }

    //     /* name */
    //     group.addShape("text", {
    //       attrs: {
    //         text: cfg.name,
    //         x: 19,
    //         y: 19,
    //         fontSize: 14,
    //         fontWeight: 700,
    //         textAlign: "left",
    //         textBaseline: "middle",
    //         fill: config.fontColor,
    //         cursor: "pointer",
    //       },
    //       // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //       name: "name-text-shape",
    //     });

    //     /* the description text */
    //     group.addShape("text", {
    //       attrs: {
    //         text: cfg.keyInfo,
    //         x: 19,
    //         y: 45,
    //         fontSize: 14,
    //         textAlign: "left",
    //         textBaseline: "middle",
    //         fill: config.fontColor,
    //         cursor: "pointer",
    //       },
    //       // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //       name: "bottom-text-shape",
    //     });

    //     if (nodeError) {
    //       group.addShape("text", {
    //         attrs: {
    //           x: 191,
    //           y: 62,
    //           text: "⚠️",
    //           fill: "#000",
    //           fontSize: 18,
    //         },
    //         // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //         name: "error-text-shape",
    //       });
    //     }

    //     const hasChildren = cfg.children && cfg.children.length > 0;
    //     if (hasChildren) {
    //       nodeBasicMethod.createNodeMarker(group, cfg.collapsed, 236, 32);
    //     }
    //     return container;
    //   },
    //   // afterDraw: nodeBasicMethod.afterDraw,
    //   setState: (name, value, item) => {
    //     const hasOpacityClass = [
    //       "ip-cp-line",
    //       "ip-cp-bg",
    //       "ip-cp-icon",
    //       "ip-cp-box",
    //       "ip-box",
    //       "collapse-icon-bg",
    //     ];
    //     const group = item.getContainer();
    //     const childrens = group.get("children");
    //     if (name === "emptiness") {
    //       if (value) {
    //         childrens.forEach((shape) => {
    //           if (hasOpacityClass.indexOf(shape.get("name")) > -1) {
    //             return;
    //           }
    //           shape.attr("opacity", 0.4);
    //         });
    //       } else {
    //         childrens.forEach((shape) => {
    //           if (hasOpacityClass.indexOf(shape.get("name")) > -1) {
    //             return;
    //           }
    //           shape.attr("opacity", 1);
    //         });
    //       }
    //     }
    //     if (name === "collapse") {
    //       const group = item.getContainer();
    //       const collapseText = group.find(
    //         (e) => e.get("name") === "collapse-text"
    //       );
    //       if (collapseText) {
    //         if (!value) {
    //           collapseText.attr({
    //             text: "-",
    //           });
    //         } else {
    //           collapseText.attr({
    //             text: "+",
    //           });
    //         }
    //       }
    //     }
    //   },
    //   getAnchorPoints: function getAnchorPoints() {
    //     return [
    //       [0, 0.5],
    //       [1, 0.5],
    //     ];
    //   },
    //   update: function update(cfg, item) {
    //     const { level, status, name } = cfg;
    //     const group = item.getContainer();
    //     let mask = group.find((ele) => ele.get("name") === "mask-shape");
    //     let maskLabel = group.find(
    //       (ele) => ele.get("name") === "mask-label-shape"
    //     );
    //     if (level === 0) {
    //       group.get("children").forEach((child) => {
    //         if (child.get("name")?.includes("collapse")) return;
    //         child.hide();
    //       });
    //       if (!mask) {
    //         mask = group.addShape("rect", {
    //           attrs: {
    //             x: -101,
    //             y: -30,
    //             width: 202,
    //             height: 60,
    //             opacity: 0,
    //             fill: "#f00",
    //           },
    //           // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //           name: "mask-shape",
    //         });
    //         maskLabel = group.addShape("text", {
    //           attrs: {
    //             fill: "#fff",
    //             fontSize: 20,
    //             x: 0,
    //             y: 10,
    //             text: name.length > 28 ? name.substr(0, 16) + "..." : name,
    //             textAlign: "center",
    //             opacity: 0,
    //           },
    //           // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    //           name: "mask-label-shape",
    //         });
    //         const collapseRect = group.find(
    //           (ele) => ele.get("name") === "collapse-back"
    //         );
    //         const collapseText = group.find(
    //           (ele) => ele.get("name") === "collapse-text"
    //         );
    //         collapseRect?.toFront();
    //         collapseText?.toFront();
    //       } else {
    //         mask.show();
    //         maskLabel.show();
    //       }
    //       mask.animate({ opacity: 1 }, 200);
    //       maskLabel.animate({ opacity: 1 }, 200);
    //       return mask;
    //     } else {
    //       group.get("children").forEach((child) => {
    //         if (child.get("name")?.includes("collapse")) return;
    //         child.show();
    //       });
    //       mask?.animate(
    //         { opacity: 0 },
    //         {
    //           duration: 200,
    //           callback: () => mask.hide(),
    //         }
    //       );
    //       maskLabel?.animate(
    //         { opacity: 0 },
    //         {
    //           duration: 200,
    //           callback: () => maskLabel.hide(),
    //         }
    //       );
    //     }
    //     // this.updateLinkPoints(cfg, group);
    //   },
    // });
    const startNode = createNodeFromReact(ReactNodeCard);
    G6.registerNode('card-node', startNode);
    G6.registerEdge("fund-polyline", {
      itemType: "edge",
      draw: function draw(cfg, group) {
        const stroke = cfg.style.stroke;
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        // const Ydiff = endPoint.y - startPoint.y;

        // const slope = Ydiff !== 0 ? Math.min(500 / Math.abs(Ydiff), 20) : 0;

        // const cpOffset = slope > 15 ? 0 : 16;
        // const offset = Ydiff < 0 ? cpOffset : -cpOffset;

        // const line1EndPoint = {
        //   x: startPoint.x + slope,
        //   y: endPoint.y + offset,
        // };
        // const line2StartPoint = {
        //   x: line1EndPoint.x + cpOffset,
        //   y: endPoint.y,
        // };

        // // 控制点坐标
        // const controlPoint = {
        //   x:
        //     ((line1EndPoint.x - startPoint.x) * (endPoint.y - startPoint.y)) /
        //       (line1EndPoint.y - startPoint.y) +
        //     startPoint.x,
        //   y: endPoint.y,
        // };

        // let path = [
        //   ["M", startPoint.x, startPoint.y],
        //   ["L", line1EndPoint.x, line1EndPoint.y],
        //   [
        //     "Q",
        //     controlPoint.x,
        //     controlPoint.y,
        //     line2StartPoint.x,
        //     line2StartPoint.y,
        //   ],
        //   ["L", endPoint.x, endPoint.y],
        // ];

        // if (Math.abs(Ydiff) <= 5) {
        //   path = [
        //     ["M", startPoint.x, startPoint.y],
        //     ["L", endPoint.x, endPoint.y],
        //   ];
        // }

        const endArrow =
          cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
        if (endArrow) endArrow.fill = stroke;

        // const stroke =
        //   (cfg.style && cfg.style.stroke) || this.options.style.stroke;
        // const startArrow = (cfg.style && cfg.style.startArrow) || undefined;
        // const endArrow = (cfg.style && cfg.style.endArrow) || undefined;

        const line = group.addShape("path", {
          attrs: {
            // path,
            path: [
              ["M", startPoint.x, startPoint.y],
              ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
              ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
              ["L", endPoint.x, endPoint.y],
            ],
            stroke,
            lineWidth: 1.2,
            endArrow,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: "path-shape",
        });
        return line;
      },
    });
  };
  useEffect(() => {
    if (!containerRef.current) return;
    registerFn();
    const width = document.getElementById("container").scrollWidth;
    const height = document.getElementById("container").scrollHeight || 500;
    
    const minimap = new G6.Minimap({
      size: [200, 100],
    })

    const graph = new G6.Graph({
      container: "container",
      width,
      height,
      layout: {
        type: "dagre",
        rankdir: "RL",
        nodesep: 80,
        ranksep: 200,
      },
      modes: {
        default: ["zoom-canvas", "drag-canvas"],
      },
      plugins: [minimap],
      defaultNode: {
        type: "card-node",
        labelCfg: {
          style: {
            fill: "#000000A6",
            fontSize: 10,
          },
        },
        style: {
          stroke: "#72CC4A",
          textOverflow: "ellipsis",
          width: 150,
        },
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: "fund-polyline",
        style: {
          stroke: "#a23df9",
          startArrow: {
            path: "M 0,0 L 12,6 L 9,0 L 12,-6 Z",
            fill: "#a23df9",
          },
          endArrow: {
            path: "M 0,0 L 12,6 L 9,0 L 12,-6 Z", // 箭头
            fill: "#a23df9",
          },
        },
      },
    });

    graph.data(data);
    graph.render();

    const handleCollapse = (e) => {
      const target = e.target;
      const id = target.get("modelId");
      const item = graph.findById(id);
      const nodeModel = item.getModel();
      nodeModel.collapsed = !nodeModel.collapsed;
      graph.layout();
      graph.setItemState(item, "collapse", nodeModel.collapsed);
    };
    graph.on("collapse-text:click", (e) => {
      handleCollapse(e);
    });
    graph.on("collapse-back:click", (e) => {
      handleCollapse(e);
    });

    const edges = graph.getEdges();
    edges.forEach(function (edge) {
      const line = edge.getKeyShape();
      const stroke = line.attr("stroke");
      const targetNode = edge.getTarget();
      targetNode.update({
        style: {
          stroke,
        },
      });
    });
    graph.paint();
    appenAutoShapeListener(graph);
    return () => {
      graph.destroy();
    };
  }, []);

  return (
    <div id="container" ref={containerRef} style={{ height: `100vh` }}></div>
  );
};

export default Demo2;
