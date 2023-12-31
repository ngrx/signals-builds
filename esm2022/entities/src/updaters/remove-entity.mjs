import { cloneEntityState, getEntityStateKeys, getEntityUpdaterResult, removeEntitiesMutably, } from '../helpers';
export function removeEntity(id, config) {
    const stateKeys = getEntityStateKeys(config);
    return (state) => {
        const clonedState = cloneEntityState(state, stateKeys);
        const didMutate = removeEntitiesMutably(clonedState, [id]);
        return getEntityUpdaterResult(clonedState, stateKeys, didMutate);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlLWVudGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc2lnbmFscy9lbnRpdGllcy9zcmMvdXBkYXRlcnMvcmVtb3ZlLWVudGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGtCQUFrQixFQUNsQixzQkFBc0IsRUFDdEIscUJBQXFCLEdBQ3RCLE1BQU0sWUFBWSxDQUFDO0FBU3BCLE1BQU0sVUFBVSxZQUFZLENBQzFCLEVBQVksRUFDWixNQUFnQztJQUVoQyxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU3QyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDZixNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxTQUFTLEdBQUcscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzRCxPQUFPLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhcnRpYWxTdGF0ZVVwZGF0ZXIgfSBmcm9tICdAbmdyeC9zaWduYWxzJztcbmltcG9ydCB7IEVudGl0eUlkLCBFbnRpdHlTdGF0ZSwgTmFtZWRFbnRpdHlTdGF0ZSB9IGZyb20gJy4uL21vZGVscyc7XG5pbXBvcnQge1xuICBjbG9uZUVudGl0eVN0YXRlLFxuICBnZXRFbnRpdHlTdGF0ZUtleXMsXG4gIGdldEVudGl0eVVwZGF0ZXJSZXN1bHQsXG4gIHJlbW92ZUVudGl0aWVzTXV0YWJseSxcbn0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFbnRpdHkoXG4gIGlkOiBFbnRpdHlJZFxuKTogUGFydGlhbFN0YXRlVXBkYXRlcjxFbnRpdHlTdGF0ZTxhbnk+PjtcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFbnRpdHk8Q29sbGVjdGlvbiBleHRlbmRzIHN0cmluZz4oXG4gIGlkOiBFbnRpdHlJZCxcbiAgY29uZmlnOiB7IGNvbGxlY3Rpb246IENvbGxlY3Rpb24gfVxuKTogUGFydGlhbFN0YXRlVXBkYXRlcjxOYW1lZEVudGl0eVN0YXRlPGFueSwgQ29sbGVjdGlvbj4+O1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUVudGl0eShcbiAgaWQ6IEVudGl0eUlkLFxuICBjb25maWc/OiB7IGNvbGxlY3Rpb24/OiBzdHJpbmcgfVxuKTogUGFydGlhbFN0YXRlVXBkYXRlcjxFbnRpdHlTdGF0ZTxhbnk+IHwgTmFtZWRFbnRpdHlTdGF0ZTxhbnksIHN0cmluZz4+IHtcbiAgY29uc3Qgc3RhdGVLZXlzID0gZ2V0RW50aXR5U3RhdGVLZXlzKGNvbmZpZyk7XG5cbiAgcmV0dXJuIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IGNsb25lZFN0YXRlID0gY2xvbmVFbnRpdHlTdGF0ZShzdGF0ZSwgc3RhdGVLZXlzKTtcbiAgICBjb25zdCBkaWRNdXRhdGUgPSByZW1vdmVFbnRpdGllc011dGFibHkoY2xvbmVkU3RhdGUsIFtpZF0pO1xuXG4gICAgcmV0dXJuIGdldEVudGl0eVVwZGF0ZXJSZXN1bHQoY2xvbmVkU3RhdGUsIHN0YXRlS2V5cywgZGlkTXV0YXRlKTtcbiAgfTtcbn1cbiJdfQ==