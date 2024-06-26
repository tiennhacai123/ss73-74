import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Job } from "../interface";
import { addJob, changeStatus, deleteJob, getJobs, updateJob } from "../store/reducer/todoListReducer";

export default function TodoList() {
  const [taskName, setTaskName] = useState<string>("");
  const [taskIdToDelete, setTaskIdToDelete] = useState<number>(0);
  const [taskIdToEdit, setTaskIdToEdit] = useState<number | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [isEmptyTaskNameWarningVisible, setIsEmptyTaskNameWarningVisible] = useState<boolean>(false);

  // Lấy danh sách công việc từ Redux store
  const jobs = useSelector((state: any) => state.jobs.jobs);
  const dispatch = useDispatch();

  // Lấy công việc từ server khi component mount
  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  // Thêm công việc mới
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() === "") {
      setIsEmptyTaskNameWarningVisible(true);
      return;
    }
    const newJob = {
      name: taskName,
      status: false,
    };
    dispatch(addJob(newJob));
    setTaskName("");
  };

  // Xử lý thay đổi tên công việc trong ô nhập liệu
  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteConfirmationModal = (id: number) => {
    setIsDeleteModalVisible(true);
    setTaskIdToDelete(id);
  };

  // Xác nhận xóa công việc
  const confirmTaskDeletion = () => {
    dispatch(deleteJob(taskIdToDelete));
    setIsDeleteModalVisible(false);
  };

  // Thay đổi trạng thái công việc
  const toggleTaskStatus = (id: number, status: boolean) => {
    dispatch(changeStatus({ id, status: !status }));
  };

  // Bắt đầu chỉnh sửa công việc
  const startEditingTask = (id: number) => {
    const jobToChange = jobs.find((item: Job) => item.id === id);
    if (jobToChange) {
      setTaskIdToEdit(id);
      setTaskName(jobToChange.name);
    }
  };

  // Cập nhật công việc
  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskIdToEdit !== null) {
      dispatch(updateJob({ id: taskIdToEdit, name: taskName }));
      setTaskIdToEdit(null);
      setTaskName("");
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
                        value={taskName}
                        onChange={handleTaskNameChange}
                        type="text"
                        id="form2"
                        className="form-control"
                      />
                      <label className="form-label" htmlFor="form2">
                        Nhập tên công việc
                      </label>
                    </div>
                    <button
                      onClick={taskIdToEdit !== null ? handleUpdateTask : handleAddTask}
                      type="submit"
                      className="btn btn-info ms-2"
                    >
                      {taskIdToEdit !== null ? "Cập nhật" : "Thêm"}
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
                                onClick={() => toggleTaskStatus(item.id, item.status)}
                              />
                              {item.status ? (
                                <s>{item.name}</s>
                              ) : (
                                <p>{item.name}</p>
                              )}
                            </div>
                            <div className="d-flex gap-3">
                              <i
                                onClick={() => startEditingTask(item.id)}
                                className="fas fa-pen-to-square text-warning"
                              />
                              <i
                                onClick={() => showDeleteConfirmationModal(item.id)}
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
      {isDeleteModalVisible && (
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
                onClick={() => setIsDeleteModalVisible(false)}
                className="btn btn-light"
              >
                Hủy
              </button>
              <button onClick={confirmTaskDeletion} className="btn btn-danger">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal cảnh báo lỗi */}
      {isEmptyTaskNameWarningVisible && (
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
                onClick={() => setIsEmptyTaskNameWarningVisible(false)}
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
