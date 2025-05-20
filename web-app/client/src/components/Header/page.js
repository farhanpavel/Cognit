"use client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { MenuIcon } from "lucide-react";
export default function Header() {
  return (
    <header className="container font-mona  mx-auto flex h-20 w-full shrink-0 justify-between items-center px-4 md:px-6 ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden ">
            <MenuIcon className="h-6 w-6 " />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white">
          <Link href="#" prefetch={false}>
            <Image
              src="/images/Group.jpg"
              width={260}
              height={200}
              alt="logo"
              className="2xl:w-[400px]"
            />
            <span className="sr-only">Company Logo</span>
          </Link>
          <div className="grid gap-2 py-6 uppercase">
            <Link
              href="#benefits"
              className="flex w-full items-center py-2 text-lg font-bold text-[#212833] "
              prefetch={false}
            >
              Service
            </Link>
            <Link
              href="#feature"
              className="flex w-full items-center py-2 text-lg font-bold text-[#212833]"
              prefetch={false}
            >
              Benefit
            </Link>
            <Link
              href="#work"
              className="flex w-full items-center py-2 text-lg font-bold text-[#212833]"
              prefetch={false}
            >
              Feature
            </Link>
            <Link
              href="#work"
              className="flex w-full items-center py-2 text-lg font-bold text-[#212833]"
              prefetch={false}
            >
              Contact
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div>
        <Link href="#" className="mr-6 hidden lg:flex  mt-1" prefetch={false}>
          <Image src="/images/Group.jpg" width={40} height={40} alt="logo" />
          <span className="sr-only">Company Logo</span>
        </Link>
      </div>
      <div>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-14  2xl:space-x-24 mt-2 flex justify-center items-center">
            <NavigationMenuLink asChild>
              <Link
                href="#benefits"
                className="group inline-flex h-9 w-max items-center justify-center   
                px-4 py-2 text-md 2xl:text-2xl font-medium transition-all 
                text-foreground/70    hover:shadow-[0_4px_2px_-2px_rgba(0,128,0,0.8)]
   
   
                duration-300"
                prefetch={false}
              >
                Service
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="#feature"
                className="group inline-flex h-9 w-max items-center justify-center   
             px-4 py-2 text-md 2xl:text-2xl font-medium transition-all 
             text-foreground/70 hover:shadow-[0_4px_2px_-2px_rgba(0,128,0,0.8)]


             duration-300"
                prefetch={false}
              >
                Feature
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="#works"
                className="group inline-flex h-9 w-max items-center justify-center   
             px-4 py-2 text-md 2xl:text-2xl font-medium transition-all 
             text-foreground/70 hover:shadow-[0_4px_2px_-2px_rgba(0,128,0,0.8)]


             duration-300"
                prefetch={false}
              >
                Benefit
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="#works"
                className="group inline-flex h-9 w-max items-center justify-center   
             px-4 py-2 text-md 2xl:text-2xl font-medium transition-all 
             text-foreground/70  hover:shadow-[0_4px_2px_-2px_rgba(0,128,0,0.8)]


             duration-300"
                prefetch={false}
              >
                Contact
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        <Link
          href="/signin"
          className="bg-tertiary  text-[0.9rem] px-5 py-2 text-white rounded-sm font-medium 2xl:px-8 2xl:py-4"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
