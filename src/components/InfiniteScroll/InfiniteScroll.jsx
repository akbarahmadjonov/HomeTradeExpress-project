/* eslint-disable react/prop-types */
import { lazy, useState } from "react";
import InfiniteScrollReact from "react-infinite-scroll-component";
import LoadingImg from "@images/card-single-loading.svg";
import { Card } from "@components/Cards/Cards";
import CardService from "@api/card.service";
import { useDispatch, useSelector } from "react-redux";
import { incPage } from "@/redux/page/pageAction.js";
import { useTranslation } from "react-i18next";
const Ads = lazy(() => import("@components/Ads/Ads"));

const InfiniteScroll = () => {
  let pageCount = useSelector((state) => state.page.page);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [fetcher, setFetcher] = useState({
    hasMore: true,
    data: [],
  });

  const fetchMoreData = async () => {
    if (fetcher.data.length < (pageCount - 3) * 12) {
      setFetcher({ hasMore: false, data: [...fetcher.data] });
      return;
    }

    setTimeout(async () => {
      const { posts } = (await CardService.getByPage(pageCount)).data;

      dispatch(incPage(pageCount));
      setFetcher({
        hasMore: fetcher.hasMore,
        data: [...fetcher.data, ...(await posts)],
      });
    }, 1500);
  };

  const loader = (
    <>
      <div className="container">
        <img
          className="m-auto d-block my-3"
          src={LoadingImg}
          width={50}
          height={50}
          style={{ background: "none" }}
        />
      </div>
    </>
  );

  return (
    <InfiniteScrollReact
      dataLength={fetcher.data.length}
      next={fetchMoreData}
      hasMore={fetcher.hasMore}
      loader={loader}
      endMessage={
        <p className="text-center fs-3 my-3 text-success p-3">
          {t("homecard.end")}
        </p>
      }
      scrollableTarget="scrollableDiv"
    >
      <div className="container">
        {fetcher.data.length ? (
          <ul className="card-list mt-4">
            {fetcher.data.length
              ? fetcher?.data?.map((item, idx) => (
                  <>
                    <Card key={idx} card={item} />
                    <Ads/>
                  </>
                ))
                : ""}
          </ul>
        ) : (
          ""
          )}
      </div>
    </InfiniteScrollReact>
  );
};

export default InfiniteScroll;
