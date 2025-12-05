"use client";

import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseButton =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 active:opacity-50";

const primaryClasses =
  [
    "border border-transparent bg-onDutyNavy text-white hover:bg-transparent hover:text-onDutyNavy hover:border-onDutyNavy",
    "dark:bg-onDutyGold dark:text-onDutyNavy dark:hover:bg-transparent dark:hover:text-onDutyGold dark:hover:border-onDutyGold",
  ].join(" ");

const secondaryClasses =
  "border border-onDutyNavy text-onDutyNavy hover:bg-onDutyNavy hover:text-white";

function classNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PrimaryButton({ href, children, className, ...rest }: ButtonProps) {
  const classes = classNames(baseButton, primaryClasses, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export function SecondaryButton({ href, children, className, ...rest }: ButtonProps) {
  const classes = classNames(baseButton, secondaryClasses, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

