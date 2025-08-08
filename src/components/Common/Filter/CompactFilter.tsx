"use client";

import {
  Input,
  Button,
  Checkbox,
  Chip,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { BiChevronDown, BiFilter, BiSearch } from "react-icons/bi";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetAllTags, GetAllTopics } from "../../../services";
import { cn } from "../../../lib/utils";
import LoadingState from "../LoadingState";
import { useDispatch } from "react-redux";
import { clearFilters, setFilterKey } from "../../../store/slices/filterSlice"; // Đảm bảo đúng path

interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  count?: number;
  disabled?: boolean;
}

interface FilterCategory {
  id: string;
  label: string;
  type: "checkbox" | "radio";
  options: FilterOption[];
  multiple?: boolean;
}

interface SortOption {
  id: string;
  label: string;
  value: string;
}

interface FilterState {
  search: string;
  filters: Record<string, string[]>;
  sort: string;
}

interface CompactFilterProps {
  tag?: boolean;
  topic?: boolean;
  sort?: boolean;
  search?: boolean;
  className?: string;
  listClassName?: string;
}

const PAGE_SIZE = 100;

export default function CompactFilter({
  tag,
  topic,
  sort,
  search,
  className = "",
  listClassName,
}: CompactFilterProps) {
  const [filterState, setFilterState] = useState<FilterState>({
    search: "",
    filters: {},
    sort: "",
  });

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const dispatch = useDispatch();

  const { data: tagData, isLoading: loadingTags } = useQuery({
    queryKey: ["tagfilters"],
    queryFn: () => GetAllTags({ limit: PAGE_SIZE, page: 1 }),
    enabled: tag,
  });

  const { data: topicData, isLoading: loadingTopics } = useQuery({
    queryKey: ["topicfilters"],
    queryFn: () => GetAllTopics({ limit: PAGE_SIZE, page: 1 }),
    enabled: topic,
  });

  const sortOptions: SortOption[] = sort
    ? [
        { id: "decs", label: "Mới nhất", value: "decs" },
        { id: "acs", label: "Cũ nhất", value: "acs" },
      ]
    : [];

  const filterCategories: FilterCategory[] = useMemo(() => {
    const categories: FilterCategory[] = [];

    if (tag && tagData?.tags) {
      categories.push({
        id: "tag",
        label: "Thẻ",
        type: "checkbox",
        multiple: true,
        options: tagData.tags.map((t: any) => ({
          id: t.id,
          label: t.name,
          value: t.id,
        })),
      });
    }

    if (topic && topicData?.topics) {
      categories.push({
        id: "topic",
        label: "Chủ đề",
        type: "checkbox",
        multiple: true,
        options: topicData.topics.map((t: any) => ({
          id: t.id,
          label: t.name,
          value: t.id,
        })),
      });
    }

    return categories;
  }, [tag, topic, tagData, topicData]);

  const handleFilterChange = useCallback(
    (categoryId: string, value: string, checked: boolean) => {
      setFilterState((prev) => {
        const current = prev.filters[categoryId] || [];
        const next = checked
          ? [...current, value]
          : current.filter((v) => v !== value);

        return {
          ...prev,
          filters: {
            ...prev.filters,
            [categoryId]: next,
          },
        };
      });
    },
    []
  );

  const handleClear = useCallback(() => {
    setFilterState({ search: "", filters: {}, sort: "" });
    dispatch(clearFilters());
  }, [dispatch]);

  // Khi nhấn nút Áp dụng bộ lọc:
  const applyFilters = () => {
    dispatch(setFilterKey({ key: "search", value: filterState.search }));
    dispatch(setFilterKey({ key: "sort", value: filterState.sort }));
    Object.entries(filterState.filters).forEach(([key, values]) => {
      dispatch(setFilterKey({ key, value: values })); // key = "tag", value = [id1, id2]
    });
  };

  const activeCount = useMemo(
    () =>
      Object.values(filterState.filters).reduce(
        (sum, arr) => sum + arr.length,
        0
      ),
    [filterState.filters]
  );

  if (loadingTags || loadingTopics) {
    return <LoadingState message="Đang tải dữ liệu" />;
  }

  return (
    <Card
      className={cn(
        `w-full max-w-xs shadow-none sticky top-[60px] md:block hidden rounded-md`,
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <BiFilter size={28} />
            <span className="text-sm font-semibold">Bộ lọc</span>
            {activeCount > 0 && (
              <Chip size="sm" color="primary" variant="flat" className="size-6">
                {activeCount}
              </Chip>
            )}
          </div>
          {activeCount > 0 && (
            <Button
              size="sm"
              variant="bordered"
              color="danger"
              radius="full"
              onPress={handleClear}
              className="text-xs px-2"
            >
              Xóa tất cả
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className="pt-0 space-y-3">
        {search && (
          <Input
            size="md"
            placeholder="Tìm kiếm..."
            value={filterState.search}
            isClearable={true}
            onClear={() => setFilterState((prev) => ({ ...prev, search: "" }))}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, search: e.target.value }))
            }
            startContent={<BiSearch size={16} />}
            classNames={{ input: "text-sm" }}
          />
        )}

        {sortOptions.length > 0 && (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                size="md"
                className="w-full justify-between"
                endContent={<BiChevronDown size={16} />}
              >
                <span className="text-sm truncate">
                  {sortOptions.find((s) => s.value === filterState.sort)
                    ?.label || "Sắp xếp theo"}
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort options"
              onAction={(key) =>
                setFilterState((prev) => ({ ...prev, sort: key as string }))
              }
              selectedKeys={
                filterState.sort ? new Set([filterState.sort]) : new Set()
              }
              selectionMode="single"
            >
              {sortOptions.map((option) => (
                <DropdownItem key={option.value}>{option.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}

        <Divider />

        {filterCategories.map((cat) => {
          const selected = filterState.filters[cat.id] || [];
          const isOpen = expanded.has(cat.id);

          return (
            <div key={cat.id} className="border-none">
              <Button
                variant="bordered"
                size="md"
                radius="sm"
                className="w-full justify-between p-3"
                onPress={() =>
                  setExpanded((prev) => {
                    const next = new Set(prev);
                    next.has(cat.id) ? next.delete(cat.id) : next.add(cat.id);
                    return next;
                  })
                }
                endContent={
                  <BiChevronDown
                    size={16}
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                <div className="flex justify-between w-full items-center">
                  <span className="text-sm font-medium">{cat.label}</span>
                  {selected.length > 0 && (
                    <Chip
                      size="sm"
                      color="primary"
                      variant="dot"
                      className="mr-2"
                    >
                      {selected.length}
                    </Chip>
                  )}
                </div>
              </Button>

              {isOpen && (
                <div
                  className={cn(
                    "px-3 py-3 border-t border-default-200 flex flex-col gap-y-2.5 space-y-3 max-h-[350px] overflow-y-auto",
                    isOpen ? "border-none" : "",
                    listClassName
                  )}
                  style={{ scrollbarWidth: "thin" }}
                >
                  {cat.options.map((opt) => {
                    const checked = selected.includes(opt.value.toString());

                    return (
                      <div
                        key={opt.id}
                        className="flex items-center justify-between"
                      >
                        <Checkbox
                          size="sm"
                          isSelected={checked}
                          onValueChange={(val) =>
                            handleFilterChange(
                              cat.id,
                              opt.value.toString(),
                              val
                            )
                          }
                          classNames={{
                            label: "text-sm flex-1",
                            wrapper: "mr-2",
                          }}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{opt.label}</span>
                          </div>
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <Divider />
        <Button
          size="sm"
          color="primary"
          onPress={applyFilters}
          className="w-full text-sm"
        >
          Áp dụng bộ lọc
        </Button>
      </CardBody>
    </Card>
  );
}
