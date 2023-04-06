import React, {useEffect, useRef, useState} from "react";
import {PageContainer, ProTable} from "@ant-design/pro-components";
import {Button, Divider, message} from "antd";
import Detail from "@/pages/ApprovalManagement/components/Detail";
import Count from "@/pages/ApprovalManagement/components/Count";
import UploadFiles from "@/pages/ApprovalManagement/components/UploadFiles";
import {ExportOrderReviewReport, LoadOrderReviewList, LoadTa} from "@/pages/ApprovalManagement/service";
import {useModel} from "@@/exports";
import dayjs from "dayjs";

const ApprovalManagement: React.FC = () => {

    const {info} = useModel('global')

    const [detailOpen, setDetailOpen] = useState<boolean>(false)

    const [countOpen, setCountOpen] = useState<boolean>(false)

    const [uploadOpen, setUploadOpen] = useState<boolean>(false)

    const [marketState, setMarketState] = useState<string>('')

    const [TAList, setTAList] = useState<any>({})

    const [selectId, setSelectId] = useState("")

    const [loading, setLoading] = useState(false)

    const form = useRef<any>(null)

    const actionRef = useRef<any>(null)

    const countButtonVisible = info?.ListPermissions?.indexOf('00000000-0000-2000-0001-000000000002') !== -1

    const uploadButtonVisible = info?.ListPermissions?.indexOf('00000000-0000-2000-0001-000000000003') !== -1

    useEffect(() => {
        LoadTa().then((res) => {

            const RxObj: any = {}
            const VxObj: any = {}

            if (res.state) {
                res?.data?.forEach((t: { MarketName: string, TAName: string }) => {

                    if (t.MarketName === 'Rx') {

                        RxObj[t.TAName] = {text: t.TAName}

                    }
                    if (t.MarketName === 'Vx') {

                        VxObj[t.TAName] = {text: t.TAName}

                    }

                })
            }

            setTAList({
                rxList: RxObj,
                vxList: VxObj
            })
        })
    }, [])

    const columns: any = [
        {
            title: 'GMeal编号',
            dataIndex: 'GCode',
            hideInSearch: true
        },
        {
            title: 'GMeal编号',
            dataIndex: 'gcode',
            hideInTable: true,
        },
        {
            title: '申请人姓名',
            dataIndex: 'ApplierName',
            hideInSearch: true
        },
        {
            title: '申请人MUDID',
            dataIndex: 'ApplierMUDID',
            hideInSearch: true
        },
        {
            title: '申请人MUDID',
            dataIndex: 'mudid',
            hideInTable: true,
        },
        {
            title: '申请人区域代码',
            dataIndex: 'TerritoryCode',
            hideInSearch: true
        },
        {
            title: '大区区域代码',
            dataIndex: 'RMTerritoryCode',
            hideInSearch: true
        },
        {
            title: '审批状态',
            valueType: 'select',
            dataIndex: 'approveState',
            hideInTable: true,
            valueEnum: {
                0: {text: '上级审批完成'},
                1: {text: 'Complete'},
                2: {text: 'Reopen'},
                3: {text: 'iSight'},
            },
        },
        {
            title: '审批时间',
            valueType: 'dateTimeRange',
            dataIndex: 'approveTime',
            hideInTable: true,
            fieldProps: {
                showTime: false,
                format: 'YYYY-MM-DD',
            }
        },
        {
            title: 'Market',
            dataIndex: 'Market',
            hideInSearch: true
        },
        {
            title: 'Market',
            dataIndex: 'market',
            valueType: 'select',
            hideInTable: true,
            fieldProps: {
                onChange: (value: string) => {
                    setMarketState(value)
                    form.current.setFieldsValue({
                        TA: null
                    })
                },
                onClear: () => {
                    setMarketState('')
                    form.current.setFieldsValue({
                        TA: null
                    })
                }
            },
            valueEnum: {
                Rx: {text: 'Rx'},
                Vx: {text: 'Vx'}
            }
        },
        {
            title: 'TA',
            dataIndex: 'TA',
            hideInSearch: true
        },
        {
            title: 'TA',
            dataIndex: 'ta',
            valueType: 'select',
            valueEnum: marketState === 'Rx' ? TAList.rxList : (
                marketState === 'Vx' ? TAList.vxList : null
            ),
            hideInTable: true
        },
        {
            title: '订单时长',
            dataIndex: 'duration',
            hideInTable: true,
        },
        {
            title: '用餐时间',
            valueType: 'dateTimeRange',
            dataIndex: 'dinnerTime',
            hideInTable: true,
            fieldProps: {
                showTime: false,
                format: 'YYYY-MM-DD',
            }
        },
        {
            title: '上级经理审批时间',
            valueType: 'dateTimeRange',
            dataIndex: 'managerApprove',
            hideInTable: true,
            fieldProps: {
                showTime: false,
                format: 'YYYY-MM-DD',
            }
        },
        {
            title: '用餐类型',
            dataIndex: 'MealType',
            hideInSearch: true
        },
        {
            title: '用餐类型',
            dataIndex: 'mealType',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
                'Internal': {text: 'Internal Meals'},
                'External': {text: 'External Meals'}
            }
        },
        {
            title: '餐厅编码',
            dataIndex: 'restaurantId',
            hideInTable: true,
        },
        {
            title: '是否超人均300',
            valueType: 'select',
            dataIndex: 'isOverAverage',
            hideInTable: true,
            valueEnum: {
                1: '是',
                0: '否'
            }
        },
        {
            title: '是否超预算金额',
            valueType: 'select',
            dataIndex: 'isOverBudget',
            hideInTable: true,
            valueEnum: {
                1: '是',
                0: '否'
            }
        },
        {
            title: '是否超季/月上限',
            valueType: 'select',
            dataIndex: 'isOverMonthQuarter',
            hideInTable: true,
            valueEnum: {
                1: '是',
                0: '否'
            }
        },
        {
            title: '用餐包括上级经理',
            valueType: 'select',
            dataIndex: 'isInviteManager',
            hideInTable: true,
            valueEnum: {
                1: '是',
                0: '否'
            }
        },
        {
            title: '是否计次',
            valueType: 'select',
            hideInTable: true,
            dataIndex: 'issue',
            valueEnum: {
                1: '是',
                0: '否'
            }
        },
        {
            title: 'onHold原因',
            valueType: 'select',
            hideInTable: true,
            dataIndex: 'onHoldReason',
            valueEnum: {
                1: '与用户沟通',
                2: '与合规沟通'
            }
        },
        {
            title: '支持文件是否Reopen',
            valueType: 'select',
            dataIndex: 'isReOpen',
            hideInTable: true,
            valueEnum: {
                1: '是',
                0: '否'
            }
        },
        {
            title: '用餐日期',
            dataIndex: 'DinnerDate',
            hideInSearch: true
        },
        {
            title: '用餐时间',
            dataIndex: 'DinnerTime',
            hideInSearch: true
        },
        {
            title: '订单状态',
            dataIndex: 'THApproveStatus',
            hideInSearch: true
        },
        {
            title: '最新修改时间',
            dataIndex: 'THApproveDate',
            hideInSearch: true
        },
        {
            title: '操作',
            hideInSearch: true,
            fixed: 'right',
            width: 200,
            render: (item: any, record: any) => {
                return <div>
                    <a
                        onClick={() => {
                            setSelectId(record.GCode)
                            setDetailOpen(true)
                        }}
                        className={'orange-a'}
                    >详情</a>
                    {(record.THApproveState !== '2' && countButtonVisible && info) ? <>
                            <Divider type={'vertical'}/>
                            <a
                                onClick={() => {
                                    setSelectId(record.GCode)
                                    setCountOpen(true)
                                }}
                                className={'orange-a'}
                            >计次</a>
                        </>
                        : null}
                    {(uploadButtonVisible && info) ? <>
                        <Divider type={'vertical'}/>
                        <a
                            className={'orange-a'}
                            onClick={() => {
                                setSelectId(record.GCode)
                                setUploadOpen(true)
                            }}
                        >上传文件</a>
                    </> : null}
                </div>
            }
        }
    ]

    return <PageContainer breadcrumb={{}}>
        <ProTable
            headerTitle={<Button
                type={'primary'}
                loading={loading}
                onClick={() => {
                    const rest = form.current.getFieldsValue()

                    let flag = false

                    if (rest.dinnerTime) {
                        rest.dinnerTimeBegin = rest.dinnerTime[0].format('YYYY-MM-DD')
                        rest.dinnerTimeEnd = rest.dinnerTime[1].format('YYYY-MM-DD')
                        const diff = rest.dinnerTime[1].diff( rest.dinnerTime[0], 'month')

                        if(diff <= 3){
                            flag = true
                        }
                        delete rest.dinnerTime
                    }

                    if (rest.managerApprove) {
                        rest.managerApproveBegin = rest.managerApprove[0].format('YYYY-MM-DD')
                        rest.managerApproveEnd = rest.managerApprove[1].format('YYYY-MM-DD')

                        const diff2 = rest.managerApprove[1].diff( rest.managerApprove[0], 'month')

                        if(diff2 <= 3){
                            flag = true
                        }
                        delete rest.managerApprove
                    }

                    if (rest.approveTime) {
                        rest.approveTimeBegin = rest.approveTime[0].format('YYYY-MM-DD')
                        rest.approveTimeEnd = rest.approveTime[1].format('YYYY-MM-DD')

                        const diff3 = rest.approveTime[1].diff( rest.approveTime[0], 'month')

                        if(diff3 <= 3){
                            flag = true
                        }
                        delete rest.approveTime
                    }

                    const requestExport = () => {
                        setLoading(true)
                        ExportOrderReviewReport(rest).then((res)=>{
                            if(res){
                                const content = res; // 文件流
                                const blob = new Blob([content], {type: 'application/vnd.ms-excel'});
                                const fileName = `Gmeal订单审核${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`;
                                if ('download' in document.createElement('a')) {
                                    // 非IE下载
                                    const link = document.createElement('a');
                                    link.download = fileName;
                                    link.href = URL.createObjectURL(blob);
                                    document.body.appendChild(link);
                                    link.click();
                                    URL.revokeObjectURL(link.href); // 释放URL 对象
                                    document.body.removeChild(link);
                                }
                                message.success('导出文件成功!')
                            }else {
                                message.error('导出文件失败！')
                            }
                        }).finally(()=>{
                            setLoading(false)
                        })
                    }

                    debugger
                    if(flag){
                        requestExport()
                    }else{
                        LoadOrderReviewList({...rest, pageSize: 20, pageIndex: 1}).then((res)=>{
                            if(res.state === 1){
                                if(res.total >= 1000){
                                    message.error('导出条数过多，请增加日期筛选条件或缩小时间范围!')
                                }else {
                                    requestExport()
                                }
                            }
                        })
                    }
                }}
            >导出文件</Button>}
            columns={columns}
            form={{
                initialValues: {
                    approveState: '0'
                }
            }}
            formRef={form}
            actionRef={actionRef}
            search={{
                layout: 'vertical',
            }}
            scroll={{
                x: 'max-content'
            }}
            request={async ({pageSize, current, ...rest}) => {

                if (rest.dinnerTime) {
                    rest.dinnerTimeBegin = rest.dinnerTime[0]
                    rest.dinnerTimeEnd = rest.dinnerTime[1]
                    delete rest.dinnerTime
                }

                if (rest.managerApprove) {
                    rest.managerApproveBegin = rest.managerApprove[0]
                    rest.managerApproveEnd = rest.managerApprove[1]
                    delete rest.managerApprove
                }

                if (rest.approveTime) {
                    rest.approveTimeBegin = rest.approveTime[0]
                    rest.approveTimeEnd = rest.approveTime[1]
                    delete rest.approveTime
                }

                const result = await LoadOrderReviewList({...rest, pageSize: pageSize, pageIndex: current})

                return {
                    success: true,
                    data: result.rows,
                    total: result.total,
                }

            }}
            pagination={{
                defaultPageSize: 10,
                showSizeChanger: true
            }}
        />
        <Detail
            open={detailOpen}
            onCancel={() => setDetailOpen(false)}
            id={selectId}
            actionRef={actionRef}
            setSelectId={setSelectId}
        />
        <Count
            open={countOpen}
            onCancel={() => setCountOpen(false)}
            id={selectId}
            actionRef={actionRef}
            setSelectId={setSelectId}
        />
        <UploadFiles
            open={uploadOpen}
            onCancel={() => setUploadOpen(false)}
            id={selectId}
            actionRef={actionRef}
            setSelectId={setSelectId}
        />

    </PageContainer>
}

export default ApprovalManagement