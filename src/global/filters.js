import useGlobalProperties from "./properties"

export default function useGlobalFilters() {
    const { $scoreType, $tern, $status } = useGlobalProperties()

    const scoreTypeOptions = $scoreType.map((label) => ({ label, value: label }))
    const ternOptions = $tern.map((T) => ({ label: T, value: T }))
    const statusOptions = $status.map((S) => ({ label: S, value: S }))
    scoreTypeOptions.shift()

    const filter = {
        tern: {
            placeholder: "学期",
            options: ternOptions,
        },
        organization: {
            placeholder: "部门",
            options: [],
        },
        activityType: {
            placeholder: "学分类型",
            options: scoreTypeOptions,
        },
        status: {
            placeholder: "状态",
            options: statusOptions
        }
    }

    return { ...filter }
}