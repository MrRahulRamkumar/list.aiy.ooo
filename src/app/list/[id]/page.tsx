import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { List } from "lucide-react";
import { Folder } from "lucide-react";

export default function Component() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="overflow-hidden rounded-lg shadow">
        <CardHeader className="flex items-center justify-between px-4 py-5 sm:px-6">
          <CardTitle className="text-lg font-medium leading-6 text-gray-900">
            Collaborative Shopping List
          </CardTitle>
          <div>
            <div className="mr-2 inline-flex justify-center rounded-full border border-transparent bg-indigo-600 p-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <List className="h-4 w-4" />
            </div>
            <div className="inline-flex justify-center rounded-full border border-transparent bg-green-600 p-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              <Folder className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <h2 className="mb-4 text-lg font-medium leading-6 text-gray-900">
              Dairy
            </h2>
            <ul className="-my-5 divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <Checkbox className="text-indigo-600" id="item1" />
                  <span className="block">
                    <span className="text-sm font-medium text-gray-900">
                      Eggs (12 numbers)
                    </span>
                    <span className="text-sm text-gray-500">
                      <br />
                      Added by
                      <Link
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        href="#"
                      >
                        Alice
                      </Link>
                    </span>
                  </span>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <Checkbox checked className="text-indigo-600" id="item2" />
                  <span className="block">
                    <span className="text-sm font-medium text-gray-900">
                      Milk (1 gallon)
                    </span>
                    <span className="text-sm text-gray-500">
                      <br />
                      Added by
                      <Link
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        href="#"
                      >
                        Bob
                      </Link>
                      <br />
                      Checked by
                      <Link
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        href="#"
                      >
                        Charlie
                      </Link>
                      on Dec 18, 2023
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
