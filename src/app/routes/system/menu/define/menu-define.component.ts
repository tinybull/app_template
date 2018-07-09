import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SysMenuService} from '../menu.service';
import {HttpResponse} from '@angular/common/http';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {KEYS, TREE_ACTIONS, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';

import 'brace/mode/javascript';
import 'brace/theme/clouds';
import 'brace/mode/json';
import * as _ from 'lodash';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {ITreeNode} from 'angular-tree-component/dist/defs/api';
import {determineDuplicateId} from './duplicate';

@Component({
    templateUrl: './menu-define.html',
    styleUrls: ['./menu-define.less']
})
export class MenuDefineComponent implements OnInit {
    @ViewChild('tree')
    tree: TreeComponent;
    loading = true;
    nodes = [
        {
            id: 1,
            name: 'root1',
            children: [
                {id: 2, name: 'child1'},
                {id: 3, name: 'child2'}
            ]
        },
        {
            id: 4,
            name: 'root2',
            children: [
                {id: 5, name: 'child2.1'},
                {
                    id: 6,
                    name: 'child2.2',
                    children: [
                        {id: 7, name: 'subsub'}
                    ]
                }
            ]
        }
    ];
    options = {};
    formModel = {
        nodeParam: {
            id: '',
            text: '',
            serverID: '',
            apiArray: [],
            link: '',
            icon: '',
            tile_size: '',
            background: '',
            textShowFlag: ''
        },

    };
    menuData = [];
    menuDataStr;
    originMenuDataStr;
    aceConfig = {
        text: '',
        textChanged: (text) => {
            this.aceConfig.text = text;
            this.menuData = JSON.parse(text);
        },
        options: {
            printMargin: false
        }
    };

    imgOptions = [
        {
            label: '思考',
            src: 'system/tile_userInfo.png'
        }, {
            label: '记笔记',
            src: 'system/tile_userInfo2.png'
        }, {
            label: '任务日志管理',
            src: 'tile_taskLogManage.png'
        }, {
            label: '定时任务管理',
            src: 'tile_taskConfigManage.png'
        }, {
            label: '特殊日期配钞设置',
            src: 'tile_spDateAddnotes.png'
        }, {
            label: '多维分析模版开发',
            src: 'tile_olapAnalysis.png'
        }
    ];


    @ViewChild(ContextMenuComponent) contextMenu: ContextMenuComponent;


    pNode: TreeNode;
    searchOptions;

    constructor(private service: SysMenuService,
                private modal: NzModalService,
                private message: NzMessageService,
                private contextMenuService: ContextMenuService) {
        this.options = {
            idField: 'id',
            displayField: 'text',
            useVirtualScroll: true,
            allowDrag: (node) => node.isLeaf,
            allowDrop: (element, {parent, index}) => {
                return true;
            },
            actionMapping: {
                mouse: {
                    // 单击，显示选中菜单的属性
                    click: (tree, node, $event) => {
                        console.log('=========]');

                        $event.stopPropagation();

                        this.formModel.nodeParam = node.data;

                        if (!node.isActive) {
                            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                            this.contextMenuService.closeAllContextMenus(null);
                        }

                    },
                    // 右键: 删除菜单
                    contextMenu: (tree, node, $event) => {
                        console.log('context menu');
                        if (!node.isActive) {
                            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                        }

                        this.formModel.nodeParam = node.data;

                        console.log(node);
                        this.contextMenuService.show.next({
                            contextMenu: this.contextMenu,
                            event: $event,
                            item: node,
                        });
                        $event.preventDefault();
                        $event.stopPropagation();
                    },
                    // 双击,新增菜单
                    dblClick: (tree, node, $event) => {
                        console.log('哈哈哈');
                        // this.addMenu(node);
                    },
                    drop: (tree: TreeModel, node: TreeNode, $event: any, {from, to}: { from: any, to: any }) => {
                        // default action assumes from = node, to = {parent, index}
                        // todo(ccliu): 判断目标节点类型，如果是按钮菜单类型，需要阻止默认行为

                        if ($event.ctrlKey) {
                            tree.copyNode(from, to);
                        } else {
                            tree.moveNode(from, to);
                            if (from.parent.data.children && from.parent.data.children.length === 0) {
                                delete from.parent.data.children;
                            }
                        }
                    }
                },
                keys: {
                    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.text}`),
                }
            }
        };
        // this.searchOptions = [
        //     {value: 'A', label: 'A'},
        //     {value: 'A01', label: 'A01'},
        //     {value: 'A02', label: 'A02'}
        // ];
    }

    addChildNode(parent: ITreeNode) {
        const params = {
            id: parent.data.id + '.' + Math.floor(Math.random() * 10000000),
            text: '未命名菜单项',
            nodeType: 1
        };

        parent.data.children = parent.data.children || [];
        parent.data.children.push(params);

        this.tree.treeModel.update();
    }

    private _count = 0;

    addSiblingNode(current: ITreeNode) {
        const parent = current.parent,
            currentOrigin = current.data,
            array = parent.data.children;
        console.log(array.indexOf(currentOrigin));
        array.insert(array.indexOf(currentOrigin) + 1,
            {
                'id': 'id',
                'text': `未命名 ${this._count++}`
            });
        this.tree.treeModel.update();
    }

    notFirst(current: ITreeNode) {
        const parent = current.parent,
            currentOrigin = current.data,
            array = parent.data.children,
            index = array.indexOf(currentOrigin);
        return index !== 0;
    }

    notLast(current: ITreeNode) {
        const parent = current.parent,
            currentOrigin = current.data,
            array = parent.data.children,
            index = array.indexOf(currentOrigin);
        return index !== array.length - 1;
    }

    moveUp(current: ITreeNode) {
        const parent = current.parent,
            currentOrigin = current.data,
            array = parent.data.children,
            index = array.indexOf(currentOrigin);
        console.log(array.indexOf(currentOrigin));
        array.splice(index, 1);
        array.insert(index - 1,
            currentOrigin);
        this.tree.treeModel.update();
    }

    moveDown(current: ITreeNode) {
        const parent = current.parent,
            currentOrigin = current.data,
            array = parent.data.children,
            index = array.indexOf(currentOrigin);
        console.log(array.indexOf(currentOrigin));
        array.splice(index, 1);
        array.insert(index + 1,
            currentOrigin);
        this.tree.treeModel.update();
    }

    deleteNode(node) {
        const parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;
        _.remove(parentNode.data.children, function (child) {
            return child === node.data;
        });

        if (node.parent.data.children.length === 0) {
            // node.parent.data.hasChildren = false;
            delete node.parent.data.children;
        }
        this.tree.treeModel.update();
        this.formReset();
    }

    ngOnInit() {
        this.getMenuJson();
    }


    // 查询数据库里的菜单
    getMenuJson() {

        console.log('==================');

        this.service.qrySelfDefinedParamInfo({type: 'menu', scope: 1})
            .subscribe(data => {
                this.nodes = data.menu;
                console.log(this.menuData);
                // if (_data.retList.length > 0) {
                //     // 菜单json展示
                //     this.originMenuDataStr = _data.retList[0].content;
                //     this.menuData = JSON.parse(this.originMenuDataStr);
                //     this.menuDataStr = JSON.stringify(this.menuData, null, 2);
                //     // console.log(this.menuDataStr);
                // }
            }, (error) => {
                this.loading = false;
                console.log(error);
                if (error instanceof HttpResponse) {
                    this.message.error(error.body.retMsg);
                }
            });
    }

    // 保存菜单树
    save() {

        const result = determineDuplicateId(this.tree.treeModel.roots);
        console.log(result);

        if (result.hasDuplicateId) {
            console.error(result);
        }

        const params = {
            paramNo: '1234567890',
            type: 'menu',
            scope: 1,
            themeNo: '',
            content: JSON.stringify(this.tree.treeModel.nodes),

        };

        console.log({data: params});
        this.service.saveSystemParamConfig({data: params})
            .subscribe(_data => {
                console.log(_data);
                this.message.success('保存菜单成功！');
            }, (error) => {
                this.loading = false;
                console.log(error);
                if (error instanceof HttpResponse) {
                    this.message.error(error.body.retMsg);
                }
            });
    }


    // 刷新Json
    getJsonData() {
        // this.menuJson = this.initMenuJson;
        const json = JSON.stringify(this.tree.treeModel.nodes);
        console.log(JSON.stringify(JSON.parse(json), null, 2));
        this.menuDataStr = JSON.stringify(JSON.parse(json), null, 2);
    }

    formReset() {
        this.formModel.nodeParam = {
            id: '',
            text: '',
            serverID: '',
            apiArray: [],
            link: '',
            icon: '',
            tile_size: '',
            background: '',
            textShowFlag: ''
        };
    }

    // 重置
    reset() {
        this.menuData = JSON.parse(this.originMenuDataStr);
        this.menuDataStr = JSON.stringify(this.menuData, null, 2);
        // this.aceConfig.text = JSON.stringify(initData, null, 2);
        this.formReset();
    }


}
