import React from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { useContext } from "react";
import { Pagination } from "react-bootstrap";

const Pages = observer(() => {
    const { post } = useContext(Context);
    const pageCount = Math.ceil(post.pages / 5);
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1);
    }

    return (
        <Pagination className="mt-3">
            {pages.map((page) => (
                <Pagination.Item key={page} active={post.page === page} onClick={() => post.setPage(page)}>
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    );
});

export default Pages;
