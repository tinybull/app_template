import {TreeNode} from 'angular-tree-component';


/**
 *
 * 判断树型结构是否有相同的节点(id)
 *
 * 1.获取当前迭代节点(Node)的id值，赋值给变量predictId
 * 2.一次迭代当前节点的子节点，判断是否有子节点的id与predictId相同，
 *   如果有，标志terminate为true，idDuplicate为true
 * 3.循环迭代当前节点的父节点
 * 4.迭代子节点
 *
 * 树的遍历算法，采用深度优先遍历
 *
 * 返回：
 *
 * todo(ccliu): 该算法很消耗资源，如有必要可以考虑数组去重的简单算法，
 * 将所有的id放到一个Array中
 *
 */
export function determineDuplicateId(roots: TreeNode[]) {
    let predictId,
        predictNodeData,
        duplicateNode;

    let breakLoop = false;  // 标识是否终止整个cycle循环

    function cycle(nodes: TreeNode[]) {
        for (let i = 0; i < nodes.length && !breakLoop; i++) {
            const node: TreeNode = nodes[i];
            predictId = node.data.id;
            predictNodeData = node;

            predict(node);
            if (breakLoop) break;

            parentCycle(node);
            if (breakLoop) break;

            // 迭代子节点
            if (node.children) cycle(node.children);
        }
    }

    /**
     * 对node节点进行父级节点循环
     */
    function parentCycle(node: TreeNode) {
        if (node.parent) {
            const parentNode = node.parent;
            // 获取当前node节点在父节点属性children中的index
            const idx = parentNode.children.indexOf(node);
            for (let i = idx + 1; i < parentNode.children.length && !breakLoop; i++) {
                if (parentNode.children[i].data.id === predictId) {
                    duplicateNode = parentNode.children[i];
                    breakLoop = true;
                    break;
                }
                predict(parentNode.children[i]);
            }
            if (breakLoop) return;
            parentCycle(parentNode);
        }
    }

    /**
     * 遍历当前节点的所有子孙节点
     * 注：不判定当前node.id是否等于predictId
     */
    function predict(node: TreeNode) {
        if (node.children && node.children.length) {
            const children = node.children;
            for (let i = 0; i < children.length && !breakLoop; i++) {
                const cid = children[i].data.id;
                if (predictId === cid) {    // 找到重复节点
                    duplicateNode = children[i];
                    breakLoop = true;
                    break;
                }
                predict(children[i]);
            }
        }
    }

    cycle(roots);

    return {path: getNodePath(predictNodeData), duplicatePath: getNodePath(duplicateNode), hasDuplicateId: breakLoop};

    function getNodePath(node: TreeNode): string {
        if (!!node) {
            let path = node.data.text;
            while (node.parent && !node.parent.data.virtual) {
                path += (' <-- ' + node.parent.data.text);
                node = node.parent;
            }
            return path;
        }
    }


}






