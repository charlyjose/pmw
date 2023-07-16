import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
  HomeIcon
} from "@radix-ui/react-icons"

import { Building2Icon, Backpack, DoorOpenIcon } from "lucide-react";


export const labels = [
  {
    value: "bug",
    label: "⭐",
  },
  {
    value: "feature",
    label: "⭐⭐",
  },
  {
    value: "documentation",
    label: "⭐⭐⭐",
  },
  // {
  //   value: "bug",
  //   label: "Bug",
  // },
  // {
  //   value: "feature",
  //   label: "Feature",
  // },
  // {
  //   value: "documentation",
  //   label: "Documentation",
  // },
]

export const placements = [
  {
    value: "remote",
    label: "Remote",
    icon: Backpack,
  },
  {
    value: "hybrid",
    label: "Hybrid",
    icon: DoorOpenIcon,
  },
  {
    value: "office",
    label: "Office",
    icon: Building2Icon,
  },
]

export const locations = [
  {
    value: "london",
    label: "London",
  },
  {
    value: "manchester",
    label: "Manchester",
  },
  {
    value: "leeds",
    label: "Leeds",
  },
]

export const deadlines = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]
