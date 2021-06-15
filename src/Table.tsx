import React from "react";
import { format, fromUnixTime } from 'date-fns'
import NumberFormat from 'react-number-format';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";

//import { exportExcel } from "../../service";

const useStyles = makeStyles((theme) => ({
    root: {
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
    icon: {
        borderRadius: 4,
        width: 20,
        height: 20,
        boxShadow: "0px 0px 5px rgba(19, 19, 19, 0.25)",
        backgroundColor: "#f5f8fa",
        "$root.Mui-focusVisible &": {
            outline: "2px auto rgba(19,124,189,.6)",
            outlineOffset: 2,
        },
        "input:disabled ~ &": {
            boxShadow: "none",
            background: "rgba(206,217,224,.5)",
        },
    },
    checkedIcon: {
        backgroundColor: "#E6BE00",
        "&:before": {
            display: "block",
            width: 20,
            height: 20,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23000'/%3E%3C/svg%3E\")",
            content: '""',
        },
    },
    table: {
        minWidth: 650,
    },
    tableKey: {
        color: "#7F7F7F",
        fontWeight: "normal",
        fontSize: 14,
        textAlign: "left",
    },
    tableCell: {
        color: "#151515",
        fontSize: 14,
        textAlign: "left",
    },
}));



function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export const TableComponent = ({ rows, headCells }) => {
    const classes = useStyles();

    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    //@ts-ignore
    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const prepareExcel = () => {
        let data = rows;

        if (selected.length > 0) {
            //@ts-ignore
            data = data.filter((item) => selected.includes(item.id));
        }

        //exportExcel({ title: "employee", data });
    };

    return (
        <React.Fragment>
            <TableContainer style={{ marginTop: "10px", marginBottom: "20px", userSelect: "none" }}>
                <Table className={classes.table} size="small" aria-label="таблица">
                    <TableHead>
                        <TableRow>
                            {/* <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < rows.length}
                                    checked={rows.length > 0 && selected.length === rows.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{ "aria-label": "выбрать все" }}
                                />
                            </TableCell> */}

                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={"left"}
                                    padding={headCell.disablePadding ? "none" : "default"}
                                    //sortDirection={orderBy === headCell.id ? order : false}
                                    className={classes.tableKey}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        //direction={orderBy === headCell.id ? order : "asc"}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        {/* <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{ "aria-labelledby": labelId }}
                                                onClick={(event) => handleClick(event, row.id)}
                                            />
                                        </TableCell> */}
                                        <TableCell className={classes.tableCell} component="th" scope="row" padding="none">
                                            <a href={`https://etherscan.io/tx/${row.transaction.id}`} target="_blank">view tx</a>
                                        </TableCell>
                                        <TableCell className={classes.tableCell}>Swap {row.amount0 > 0 ? row.amount0 : row.amount1} {row.token1.symbol} for {row.amount0 > 0 ? row.amount1 * -1 : row.amount0 * -1} {row.token0.symbol}</TableCell>

                                        <TableCell className={classes.tableCell}>{format(fromUnixTime(row.timestamp), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                                        <TableCell className={classes.tableCell}><a href={`https://etherscan.io/address/${row.sender}`} target="_blank">{row.sender}</a></TableCell>
                                        <TableCell className={classes.tableCell}><a href={`https://etherscan.io/address/${row.recipient}`} target="_blank">{row.recipient}</a></TableCell>
                                        <TableCell className={classes.tableCell}><NumberFormat value={row.amountUSD} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} /></TableCell>
                                        {/* <TableCell className={classes.tableCell}>{row.origin}</TableCell> */}
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                <TableCell colSpan={9} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};