import React from 'react'

export default function AppUI() {
    return (
        <>
            <div className="a_header_container">
                <div className="row px-xll-5">
                    <div className="col-md-6 col-12 ps-xll-5">
                        <div className="a_appui_img">
                            <img src={require("../img/app.png")} alt="" />
                        </div>
                    </div>
                    <div className="col-md-6 col-12 p-xll-5 d-flex justify-content-center align-items-center">
                        <div className="a_appUI_content p-lg-5 p-md-3">
                            <div className="mb-4">
                                <h3>
                                    Connecting our user with iOS & Android apps. Download from
                                    App Store & Play store
                                </h3>
                            </div>
                            <div className="mb-4">
                                Lorem ipsum dolor sit amet consectetur. Sit in sed sed rutrum
                                ultrices egestas. Neque leo praesent odio diam. Vel amet vitae
                                pulvinar cursus enim sagittis enim. Cum arcu vitae non
                                scelerisque cursus eget mi.
                            </div>
                            <div className="d-flex align-items-center flex-xl-row flex-md-column flex-sm-row flex-column gap-4">
                                <div className="a_appUI_btns w-md-auto w-100 d-flex justify-content-center align-items-center gap-2">
                                    <div>
                                        <img src={require("../img/a_img/playstore.png")} alt="" />
                                    </div>
                                    <div>
                                        <p className="mb-0">GET IN ON</p>
                                        <h3>Google Play</h3>
                                    </div>
                                </div>
                                <div className="a_appUI_btns w-md-auto w-100 d-flex justify-content-center align-items-center gap-2">
                                    <div>
                                        <img src={require("../img/a_img/apple.png")} alt="" />
                                    </div>
                                    <div>
                                        <p className="mb-0">GET IN ON</p>
                                        <h3>Google Play</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
