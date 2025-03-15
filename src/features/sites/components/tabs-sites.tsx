"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAllSites } from "../api/hooks/use-all-sites";
import { columns } from "./columns";
import { KeywordsTable } from "./keywords-table";
import { Button } from "@/components/ui/button";
import {
  EditIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useSitesContext } from "../context/sites-context";
import { CopyLinkButton } from "@/components/shared/copy-link-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { siteServices } from "../api/services";
import { queryKeys } from "@/lib/api/query-keys";
import { toast } from "sonner";
import { EditKeywordDialog } from "./edit-keyword-dialog";
import { MutateSiteDialog } from "./mutate-site-dialog";

interface Props {
  className?: string;
}

export const TabsSites: React.FC<
  Props
> = ({ className }) => {
  const queryClient = useQueryClient();
  const {
    open,
    setOpen,
    currentRowKeyword,
    setCurrentRowKeyword,
    currentRowSite,
    setCurrentRowSite,
  } = useSitesContext();
  const [tabValue, setTabValue] =
    useState<string | undefined>(
      undefined
    );

  const {
    data: allSitesData,
    isLoading,
  } = useAllSites();

  useEffect(() => {
    if (
      !isLoading &&
      allSitesData?.length &&
      tabValue === undefined
    ) {
      setTabValue(allSitesData[0].id);
    }
  }, [
    isLoading,
    allSitesData,
    tabValue,
  ]);

  // Delete site
  const { mutate: mutateDeleteSite } =
    useMutation({
      mutationFn: async () => {
        if (!currentRowSite) return;

        await siteServices.deleteSite(
          currentRowSite.id
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.sites.all,
          refetchType: "all",
        });
        toast.success("Сайт удалён");
      },
    });

  // Delete keyword
  const {
    mutate: mutateDeleteKeyword,
  } = useMutation({
    mutationFn: async () => {
      if (!currentRowKeyword) return;

      await siteServices.deleteKeyword(
        currentRowKeyword.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sites.all,
        refetchType: "all",
      });
      toast.success(
        "Ключевое слово удалено"
      );
    },
  });

  return (
    <div className={className}>
      <Tabs
        value={tabValue}
        onValueChange={(v) =>
          setTabValue(v)
        }>
        <div className='flex justify-between'>
          <TabsList>
            {allSitesData?.map(
              (site) => (
                <TabsTrigger
                  key={site.id}
                  value={site.id}>
                  <span className='cursor-pointer'>
                    {site.url}
                  </span>

                  <span
                    onClick={() => {
                      setCurrentRowSite(
                        site
                      );
                      setOpen(
                        "edit-site"
                      );
                    }}
                    className='inline-block p-2 border rounded cursor-pointer'>
                    <EditIcon />
                  </span>

                  <span
                    onClick={() => {
                      setCurrentRowSite(
                        site
                      );
                      setOpen(
                        "delete-site"
                      );
                    }}
                    className='inline-block p-2 border rounded cursor-pointer'>
                    <TrashIcon className='text-red-500' />
                  </span>
                </TabsTrigger>
              )
            )}

            {allSitesData?.length ===
              0 && (
              <p className='px-2'>
                Сайтов и ключевых слов
                пока нет...
              </p>
            )}

            <Button
              onClick={() =>
                setOpen("add-site")
              }
              className='ml-2 -mr-2'>
              <PlusIcon />
            </Button>
          </TabsList>
          <CopyLinkButton
            link={`${window.location.origin}/backend/site/keyword`}>
            Получить ссылку на следующее
            ключевое слово
          </CopyLinkButton>
        </div>

        {allSitesData?.map((site) => (
          <TabsContent
            key={site.id}
            value={site.id}>
            <KeywordsTable
              columns={columns}
              isLoading={isLoading}
              data={site.keywords}
              linkToNextKeyword={`${window.location.origin}/backend/site/${site.userId}/${site.id}/next-keyword`}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialogs */}

      <MutateSiteDialog
        key='add-site-dialog'
        open={open === "add-site"}
        onOpenChange={() =>
          setOpen("add-site")
        }
      />

      {currentRowSite && (
        <>
          <MutateSiteDialog
            key='update-site-dialog'
            currentRow={currentRowSite}
            open={open === "edit-site"}
            onOpenChange={() =>
              setOpen("edit-site")
            }
          />
          <ConfirmDialog
            key='site-delete'
            destructive
            open={
              open === "delete-site"
            }
            onOpenChange={() => {
              setOpen("delete-site");
              setTimeout(() => {
                setCurrentRowKeyword(
                  null
                );
              }, 500);
            }}
            handleConfirm={() => {
              setOpen(null);
              mutateDeleteSite();
            }}
            title={`Вы уверены что хотите удалить сайт: ${currentRowSite.url}?`}
            desc='Это действие необратимо.'
            confirmText='Удалить'
          />
        </>
      )}

      {currentRowKeyword && (
        <>
          <ConfirmDialog
            key='keyword-delete'
            destructive
            open={
              open === "delete-keyword"
            }
            onOpenChange={() => {
              setOpen("delete-keyword");
              setTimeout(() => {
                setCurrentRowKeyword(
                  null
                );
              }, 500);
            }}
            handleConfirm={() => {
              setOpen(null);
              mutateDeleteKeyword();
            }}
            title={`Вы уверены что хотите удалить ключевое слово: ${currentRowKeyword.text}?`}
            desc='Это действие необратимо.'
            confirmText='Удалить'
          />

          <EditKeywordDialog
            currentRow={
              currentRowKeyword
            }
            open={
              open === "edit-keyword"
            }
            onOpenChange={() => {
              setOpen("edit-keyword");
              setTimeout(() => {
                setCurrentRowKeyword(
                  null
                );
              }, 500);
            }}
          />
        </>
      )}
    </div>
  );
};
