import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Col, Card } from 'react-bootstrap'
import { Context } from "../index";
import { DEVICE_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { fetchDevices } from '../http/deviceAPI';

const PopularPosts = observer(() => {
  const { device } = useContext(Context)

  useEffect(() => {
    fetchDevices(null, null, 1, 4).then(data => {
      device.setDevices(data.rows)
      device.setTotalCount(data.count)
    })
  }, [])

  console.log(`device.devices: ${JSON.stringify(device.devices, null, 2)}`)
  return (
    <Col lg={4}>
      <Card className="right-rail-wrapper WikiaRail p-3"
        style={{ backgroundColor: "white" }}
      >
        {/* <div id="rail-boxad-wrapper"><div id="affiliate_slot" className="gpt-ad hide"></div><div id="top_boxad" className="gpt-ad"></div></div>
            <div id="WikiaRail" className="is-ready"></div> */}
        {/* <div className="sticky-modules-wrapper">
              <div id="WikiaAdInContentPlaceHolder" className="rail-module"> */}
        <section className="popular-pages premium-recirculation-rail" id="recirculation-rail">
          <h4 className="auth__title auth__title--fiol">Популярные страницы</h4>
          <ul className="rail-module__list thumbnails p-0">
            {
              device.devices.map(device =>
                <li className="popular-pages__item">
                  <Link
                    // onClick={() => history.push(DEVICE_ROUTE + '/' + device.id)}
                    to={DEVICE_ROUTE + '/' + device.id}
                    title={`${device.description}`}
                    data-tracking-label="article-1">
                    <img className="popular-pages__image"
                      src={process.env.REACT_APP_API_URL + device.img}
                      alt={`Картинка ${device.name}`} />
                    <span>{device.name}</span>
                  </Link>
                </li>
              )
            }
          </ul>
        </section>
        {/* <div id="incontent_boxad_1"></div>
              </div>
            </div> */}
      </Card>
    </Col>
  )
})

export default PopularPosts
