/**
 * 获得tree的所有父子集id
 * @param {Array} list 要遍历的菜单树
 * @param {Array} arr 接受数组
 */
export function getMenuKeys(list, arr) {
    Array.isArray(list) && list.map((v) => {
        arr.push(v.id);
        if (v.children) {
            getMenuKeys(v.children, arr);
        }
    });
}

/**
 * 将菜单树遍历为一维数组
 * @param {Array} list 菜单树
 */
export function menuPlane(list){
    let arr = [];
    Array.isArray(list) && list.map(v => {
        arr.push(v);
        if (v.children) {
            arr = arr.concat(menuPlane(v.children));
        }
    });
    return arr;
}