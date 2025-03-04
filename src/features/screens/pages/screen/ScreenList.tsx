"use client";
import React, { useState, useEffect } from "react";
import { IconFilePlus } from "@tabler/icons-react";
import CreateAdModal from "../../widgets/CreateScreenModal";
import axios from "axios";
import Card from "../../widgets/Card";
import Pagination from "../../widgets/Pagination";

const ScreenList = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchForms = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/screen?page=${page}&limit=5`,
      );
      if (response && response.data) {
        const { screens, pagination } = response.data;
        setData(screens);
        setTotalPages(pagination.totalPages);
        setCurrentPage(page);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-[4.8rem] w-full bg-n20 p-4">
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">Your screen</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8"
            onClick={() => setShowModal(true)}
          >
            <IconFilePlus size={48} className="text-gray-600" />
            <button className="mt-4 text-gray-600">Create new screen</button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : data?.length > 0 ? (
            data.map((data, index) => (
              <Card data={data} index={index} key={index} />
            ))
          ) : (
            <p className="text-gray-500">No screens available.</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <CreateAdModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default ScreenList;
