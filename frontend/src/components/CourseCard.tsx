import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
// import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface Props {
  course: any;
  userRole?: string;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export default function CourseCard({
  course,
  userRole,
  onDelete,
  onEdit,
}: Props) {
  return (
    <Card className="shadow-md rounded-2xl gap-2">
      <CardHeader className="flex justify-between items-start">
        <CardTitle>{course.title}</CardTitle>
        {userRole === "merchant" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 cursor-pointer">
                <BsThreeDotsVertical />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(course._id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      {/* <CardContent>
        {course.thumbnail && (
          <img src={course.thumbnail} alt="thumbnail" className="w-full h-32 object-cover rounded mb-2" />
        )}
        <p className="text-gray-600 mb-2">{course.description}</p>
        <p className="font-semibold">₹{course.price}</p>
        <p className="text-sm text-gray-500">Interval: {course.interval}</p>
        <div className="text-right">
        <Link
          to={`/courses/${course._id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          View Details
        </Link>
        </div>
      </CardContent> */}
      <CardContent>
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt="thumbnail"
            className="w-full h-32 object-cover rounded mb-2"
          />
        )}
        <p className="text-gray-600 mb-2">{course.description}</p>
        {/* Display price with interval */}
        <p className="font-semibold">
          ₹{course.price}/{course.interval}
        </p>
        <div className="text-right">
          <Link
            to={`/courses/${course._id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
