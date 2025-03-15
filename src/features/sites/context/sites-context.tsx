"use client";
import React from "react";
import {
  Keyword,
  Site,
} from "../data/schema";
import useDialogState from "@/lib/hooks/use-dialog-state";

export type SitesDialogType =
  | "add-site"
  | "edit-site"
  | "delete-site"
  | "add-keyword"
  | "edit-keyword"
  | "delete-keyword";

interface SitesContextType {
  open: SitesDialogType | null;
  setOpen: (
    str: SitesDialogType | null
  ) => void;
  currentRowSite: Site | null;
  setCurrentRowSite: React.Dispatch<
    React.SetStateAction<Site | null>
  >;
  currentRowKeyword: Keyword | null;
  setCurrentRowKeyword: React.Dispatch<
    React.SetStateAction<Keyword | null>
  >;
}

const SitesContext =
  React.createContext<SitesContextType | null>(
    null
  );

interface Props {
  children: React.ReactNode;
}

export function SitesContextProvider({
  children,
}: Props) {
  const [open, setOpen] =
    useDialogState<SitesDialogType>(
      null
    );

  const [
    currentRowSite,
    setCurrentRowSite,
  ] = React.useState<Site | null>(null);
  const [
    currentRowKeyword,
    setCurrentRowKeyword,
  ] = React.useState<Keyword | null>(
    null
  );

  const value: SitesContextType = {
    open,
    setOpen,
    currentRowSite,
    setCurrentRowSite,
    currentRowKeyword,
    setCurrentRowKeyword,
  };

  return (
    <SitesContext.Provider
      value={value}>
      {children}
    </SitesContext.Provider>
  );
}

export const useSitesContext = () => {
  const sitesContext = React.useContext(
    SitesContext
  );

  if (!sitesContext) {
    throw new Error(
      "useSitesContext has to be used within <SitesContext.Provider>"
    );
  }

  return sitesContext;
};
