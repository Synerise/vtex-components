export const CATEGORY_STATE = {
  checked: 'checked',
  unchecked: 'unchecked',
  indeterminate: 'indeterminate',
} as const

type CategoryStateType = (typeof CATEGORY_STATE)[keyof typeof CATEGORY_STATE]

export type CategoryLevelType = {
  count: number
  value: string
  state: CategoryStateType
  children: CategoryTreeType
  parent: CategoryLevelType | null
  root: CategoryTreeType
}

export type CategoryTreeType = Record<string, CategoryLevelType>

const getSelected = (root: CategoryTreeType) => {
  const selected: string[] = []

  const getHighestSelected = (tree: CategoryTreeType) => {
    for (const node of Object.values(tree)) {
      if (node.state === CATEGORY_STATE.checked) {
        selected.push(node.value)
      } else {
        getHighestSelected(node.children)
      }
    }
  }

  getHighestSelected(root)

  return selected
}

export const updateParentStates = (parent: CategoryLevelType | null) => {
  if (!parent) return

  const countValue = {
    checked: 1,
    unchecked: 0,
    indeterminate: 0.5,
  }

  const children = Object.values(parent.children)
  const checkedCount = children.reduce(
    (count, child) => count + countValue[child.state],
    0
  )

  if (checkedCount === children.length) parent.state = CATEGORY_STATE.checked
  else if (checkedCount > 0) parent.state = CATEGORY_STATE.indeterminate
  else parent.state = CATEGORY_STATE.unchecked

  updateParentStates(parent.parent)
}

export const setCheckedCategory = (
  node: CategoryLevelType,
  value: CategoryStateType = CATEGORY_STATE.checked
) => {
  node.state = value
  updateParentStates(node.parent)

  for (const child of Object.values(node.children)) {
    setCheckedCategory(child, value)
  }

  return getSelected(node.root)
}

export function mapCategoriesToTree(
  categoryData: Record<string, number>,
  checked: string[] = []
) {
  const entries = Object.entries(categoryData)
  const toCheck: CategoryLevelType[] = []

  const formattedData = entries.reduce((obj, [categories, count]) => {
    const subcategories = categories.split('>')
    let current: CategoryTreeType = obj
    let currentParent: CategoryLevelType | null = null

    subcategories.forEach((category, i) => {
      if (!current[category]) {
        current[category] = {
          count: 0,
          value: '',
          state: CATEGORY_STATE.unchecked,
          children: {},
          parent: currentParent,
          root: obj,
        }
      }

      if (i === subcategories.length - 1) {
        current[category].count = count
        current[category].value = categories
        if (checked.includes(categories)) {
          toCheck.push(current[category])
        }
      }

      currentParent = current[category]
      current = current[category].children
    })

    return obj
  }, {})

  toCheck.forEach((category) => {
    setCheckedCategory(category, CATEGORY_STATE.checked)
  })

  return formattedData
}
