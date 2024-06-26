import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Job } from "../interface";
import {addJob,changeStatus,deleteJob,getJobs,updateJob,} from "../store/reducer/todoListReducer";

export default function TodoList() {
  const [inputValue, setInputValue] = useState<string>("");
  const [checkIdDelete, setCheckIdDelete] = useState<number>(0);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);

  const jobs = useSelector((state: any) => {
    return state.jobs.jobs;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);
  //   hàm thêm công việc
  const addNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      setShowModalAdd(true);
      return;
    }
    const newJob = {
      name: inputValue,
      status: false,
    };
    dispatch(addJob(newJob));
    setInputValue("");
  };

  // hàm lấy giá trị trong input
  const valueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  //   hàm hiển thị modal xóa
  const handleModalDelete = (id: number) => {
    setShowModalDelete(true);
    setCheckIdDelete(id);
  };

  //hàm xóa công việc
  const handleDeleteJob = () => {
    dispatch(deleteJob(checkIdDelete));
    setShowModalDelete(false);
  };

  //hàm checked công việc
  const checkedJob = (id: number, status: boolean) => {
    dispatch(changeStatus({ id, status: !status }));
  };

  //   hàm chỉnh sửa công việc
  const handleChange = (id: number) => {
    const jobToChange = jobs.find((item: Job) => item.id === id);
    if (jobToChange) {
      setSelectedJobId(id);
      setInputValue(jobToChange.name);
    }
  };
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJobId !== null) {
      dispatch(updateJob({ id: selectedJobId, name: inputValue }));
      setSelectedJobId(null);
      setInputValue("");
    }
  };
  return (
    <div>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form className="d-flex justify-content-center align-items-center mb-4">
                    <div className="form-outline flex-fill">
                      <input
                        value={inputValue}
                        onChange={valueInput}
                        type="text"
                        id="form2"
                        className="form-control"
                      />
                      <label className="form-label" htmlFor="form2">
                        Nhập tên công việc
                      </label>
                    </div>
                    <button
                      onClick={
                        selectedJobId !== null ? handleUpdate : addNewJob
                      }
                      type="submit"
                      className="btn btn-info ms-2"
                    >
                      {selectedJobId !== null ? "Cập nhật" : "Thêm"}
                    </button>
                  </form>
                  {/* Tabs navs */}
                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li className="nav-item" role="presentation">
                      <a className="nav-link active">Tất cả</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Đã hoàn thành</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Chưa hoàn thành</a>
                    </li>
                  </ul>
                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {jobs.map((item: Job, index: number) => (
                          <li
                            key={index}
                            className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                            style={{ backgroundColor: "#f4f6f7" }}
                          >
                            <div>
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                checked={item.status}
                                onClick={() => checkedJob(item.id, item.status)}
                              />
                              {item.status ? (
                                <s>{item.name}</s>
                              ) : (
                                <p>{item.name}</p>
                              )}
                            </div>
                            <div className="d-flex gap-3">
                              <i
                                onClick={() => handleChange(item.id)}
                                className="fas fa-pen-to-square text-warning"
                              />
                              <i
                                onClick={() => handleModalDelete(item.id)}
                                className="far fa-trash-can text-danger"
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Modal xác nhận xóa */}
      {showModalDelete && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Xác nhận</h5>
              <i className="fas fa-xmark" />
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn xóa công việc này?</p>
            </div>
            <div className="modal-footer-footer">
              <button
                onClick={() => setShowModalDelete(false)}
                className="btn btn-light"
              >
                Hủy
              </button>
              <button onClick={handleDeleteJob} className="btn btn-danger">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal cảnh báo lỗi */}
      {showModalAdd && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Cảnh báo</h5>
              <i className="fas fa-xmark" />
            </div>
            <div className="modal-body-custom">
              <p>Tên công việc không được phép để trống.</p>
            </div>
            <div className="modal-footer-footer">
              <button
                onClick={() => setShowModalAdd(false)}
                className="btn btn-light"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
