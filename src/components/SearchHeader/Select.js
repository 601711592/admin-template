import {
    Select
} from 'antd';

const { Option } = Select;

const Index = ({
    data,
    getFieldDecorator,
    name,
    options
}) => {
    const OptionList = data && data.map(v => (
        <Option value={v.value} key={v.value}>{v.name}</Option>
    ));

    return (
        getFieldDecorator(name, options)(
            <Select style={{ minWidth: 120 }}>
                {OptionList}
            </Select>
        )
    )
}

export default Index;