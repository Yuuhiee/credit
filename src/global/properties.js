export default function useGlobalProperties() {
    // const { appContext: { config: { globalProperties } } } = getCurrentInstance();
    // const { $scoreType, $year } = globalProperties

    const properties = {
        $scoreType: ["", "日常行为分", "个性发展分", "创新创业分", "讲座文化素质分"],
        $status: ["待提交", "已通过", "待审批", "已拒绝"],
        $year: [2023, 2024, 2025],
    }
    properties.$tern = properties.$year.map(item => [item + '春季', item + '秋季']).flat()

    return {
        // ...globalProperties,
        ...properties
    }
}