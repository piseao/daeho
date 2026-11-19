export const defaultCategories=['AI·IT 선교','홈페이지 제작','AI 교육','운영 노하우','선교 현장','신앙과 일상','함께하는 기도','성경의 여정','쉼과 묵상','배움과 나눔'];
export const getCategories=d=>d.categories??defaultCategories;
const excluded=new Set(['our-confession','we-pray-together','bethlehem-night','a-place-to-rest']);
export const columnPosts=d=>d.posts.filter(p=>p.published&&!excluded.has(p.slug));
export function changeCategory(d,oldName,newName){
 const list=[...getCategories(d)],name=newName.trim();
 if(!name||name.length>50||name==='전체'||list.includes(name))throw Error('중복되지 않는 1~50자 분류 이름을 입력하세요.');
 if(oldName!==null&&!list.includes(oldName))throw Error('분류를 찾을 수 없습니다.');
 d.categories=oldName===null?[...list,name]:list.map(c=>c===oldName?name:c);
 if(oldName!==null)d.posts.forEach(p=>{if(p.category===oldName)p.category=name;});
}
export function removeCategory(d,name,target){
 const list=getCategories(d);if(!list.includes(name)||list.length<2)throw Error('최소 한 개의 분류가 필요합니다.');
 if(d.posts.some(p=>p.category===name)&&(!list.includes(target)||target===name))throw Error('글을 옮길 다른 분류를 선택하세요.');
 d.posts.forEach(p=>{if(p.category===name)p.category=target;});d.categories=list.filter(c=>c!==name);
}
