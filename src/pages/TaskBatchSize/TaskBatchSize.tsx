import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  InputBase,
  InputAdornment,
  Button,
  FormHelperText,
  Modal,
} from "@mui/material";
import { useIntl, FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import {
  edit_ic,
  saveIcon,
  search_ic,
  cancelIcon,
  info_ic,
} from "../../assets/images";
import { BkdService } from "../../services/bkd-service";
import { StatusCode } from "../../utils/constant";
import { BkdServiceModel } from "../../models/jobs/BkdServiceModel";

function BackendService() {
  const intl = useIntl();

  const [data, setData] = useState<BkdServiceModel[]>([]);
  const [filteredData, setFilteredData] = useState<BkdServiceModel[]>([]);
  const [searchText, setSearchText] = useState("");

  const [editableRowId, setEditableRowId] = useState<number | null>(null);
  const [batchValue, setBatchValue] = useState<string>("");

  const [note, setNote] = useState("");
  const [openNote, setOpenNote] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const res = await BkdService.getallBkdServices();
      if (res.data?.length > 0) {
        setData(res.data);
        setFilteredData(res.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (err: any) {
      err?.response?.data?.errors?.map((e: string) => toast.error(e));
    }
  };

  // ================= SEARCH =================
  const onSearch = () => {
    const filtered = data.filter(
      (d) =>
        !searchText ||
        d.serviceName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    if (searchText === "") onSearch();
  }, [searchText, data]);

  // ================= EDIT =================
  const handleEdit = (row: BkdServiceModel) => {
    setEditableRowId(row.serviceId);
    setBatchValue(String(row.batchSize));
  };

  const handleSave = async (row: BkdServiceModel) => {
    const model = {
      serviceId: row.serviceId,
      batchSize: Number(batchValue),
    };

    try {
      const res = await BkdService.updateBkdServicesBatchSize(model);

      if (res.status === StatusCode.Success) {
        toast.success(
          res.data?.serviceId
            ? "Batch Size updated successfully"
            : "Request Pending Approval"
        );
        setEditableRowId(null);
        getList();
      }
    } catch (err: any) {
      err?.response?.data?.errors?.map((e: string) => toast.error(e));
    }
  };

  // ================= UI =================
  return (
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">

          {/* HEADER */}
          <div className="title-block">
            <div className="left-block mb-0">
              <Typography variant="h2">
                Task Batch Size
              </Typography>
              <p>Manage Task Batch Size</p>
            </div>

            <div className="right-block">
              <InputBase
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={onSearch}>
                      <img src={search_ic} alt="search" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </div>

          {/* TABLE */}
          <TableContainer className="has-vertical-scroll">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Batch Size</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.serviceId}>
                    
                    <TableCell>{row.serviceName}</TableCell>

                    <TableCell>
                      {editableRowId === row.serviceId ? (
                        <>
                          <InputBase
                            type="number"
                            value={batchValue}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (Number(val) >= 0) {
                                setBatchValue(val.slice(0, 9));
                              }
                            }}
                          />
                        </>
                      ) : (
                        row.batchSize
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <div className="action btns-block">

                        {editableRowId === row.serviceId ? (
                          <IconButton onClick={() => handleSave(row)}>
                            <img src={saveIcon} alt="save" />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => handleEdit(row)}>
                            <img src={edit_ic} alt="edit" />
                          </IconButton>
                        )}

                        {/* <IconButton onClick={() => setOpenNote(true)}>
                          <img src={info_ic} alt="info" />
                        </IconButton> */}

                      </div>
                    </TableCell>

                  </TableRow>
                ))}

                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <p style={{ textAlign: "center" }}>
                        No Data Found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* NOTE MODAL */}
          <Modal open={openNote}>
            <div className="user-card-modal">
              <IconButton
                className="btn-close"
                onClick={() => setOpenNote(false)}
              >
                <img src={cancelIcon} alt="close" />
              </IconButton>

              <label>Note</label>

              <InputBase
                placeholder="Enter Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                multiline
                fullWidth
                className="textarea"
              />

              <div className="save-btn-grp">
                <Button onClick={() => setOpenNote(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>

        </div>
      </main>
    </div>
  );
}

export default BackendService;