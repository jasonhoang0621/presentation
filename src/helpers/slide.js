import {
  HeartFilled,
  QuestionOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";

export const SlideType = {
  MULTIPLE_CHOICE: "multiple_choice",
  HEADING: "heading",
  PARAGRAPH: "paragraph",
};

export const Reaction = [
  {
    type: "heart",
    Icon: HeartFilled,
  },
  {
    type: "smile",
    Icon: QuestionOutlined,
  },
  {
    type: "like",
    Icon: LikeFilled,
  },
  {
    type: "dislike",
    Icon: DislikeFilled,
  },
];
