"use client";

import { useEffect, useState, useRef } from 'react';
import { studentTopicService } from '@/services/student/topic.service';
import { Pagination } from '@/components/Pagination';
import { TopicsLoading } from '@/components/student/topics/TopicLoading';
import { TopicsHeader } from '@/components/student/topics/TopicsHeader';
import { TopicsGrid } from '@/components/student/topics/TopicsGrid';
import { Topic, TopicDataResponse } from '@/types/student/index.types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export default function TopicsPage() {
  const [topicsData, setTopicsData] = useState<Topic[]>([]);
  const [pagination, setPagination] = useState<TopicDataResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);

  // Debounced values
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const debouncedPage = useDebouncedValue(page, 300);
  const debouncedLimit = useDebouncedValue(itemsPerPage, 300);

  const isFetching = useRef(false);
  const lastFetchParams = useRef({ page: 1, itemsPerPage: 8, searchQuery: '', sortBy: 'recent' });

  useEffect(() => {
    const currentParams = { page: debouncedPage, itemsPerPage: debouncedLimit, searchQuery: debouncedSearch, sortBy };

    // Skip if already fetching with same params
    if (isFetching.current) {
      const sameParams =
        lastFetchParams.current.page === debouncedPage &&
        lastFetchParams.current.itemsPerPage === debouncedLimit &&
        lastFetchParams.current.searchQuery === debouncedSearch &&
        lastFetchParams.current.sortBy === sortBy;

      if (sameParams) {
        return;
      }
    }

    const fetchTopics = async () => {
      isFetching.current = true;
      lastFetchParams.current = currentParams;

      try {
        setLoading(true);
        const response = await studentTopicService.getTopics({
          page: debouncedPage,
          limit: debouncedLimit,
          search: debouncedSearch.trim() || undefined,
          sortBy
        });
        setTopicsData(response.topics || []);
        setPagination(response.pagination);
      } catch (e) {
        // Error is handled by API client interceptor
        console.error("Topics fetch error", e);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchTopics();
  }, [debouncedPage, debouncedLimit, debouncedSearch, sortBy]);

  // Reset page to 1 when debounced search changes
  useEffect(() => {
    if (searchQuery !== debouncedSearch) {
      setPage(1);
    }
  }, [debouncedSearch, searchQuery]);


  return (

      <div className="flex flex-col mx-auto max-w-7xl w-full pb-12 px-4 sm:px-6 lg:px-8 xl:px-12 pt-8">
        <TopicsHeader
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query);
          }}
          sortBy={sortBy}
          setSortBy={(newSortBy) => {
            setSortBy(newSortBy);
            setPage(1); // Reset to first page when sorting
          }}
        />
        
        {loading ? (
          <TopicsLoading />
        ) : (
          <>
            <TopicsGrid
              topics={topicsData}
              searchQuery={searchQuery}
              pagination={
                pagination && (
                  <Pagination 
                    currentPage={pagination.page}
                    totalItems={pagination.total}
                    limit={pagination.limit}
                    onPageChange={setPage}
                    onLimitChange={(newLimit) => {
                      setItemsPerPage(newLimit);
                      setPage(1); // Reset to first page when changing limit
                    }}
                    showLimitSelector={true}
                    loading={loading}
                  />
                )
              }
            />
          </>
        )}
        
      </div>
    
  );
}
