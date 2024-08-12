import { Check, Close } from '@mui/icons-material';
import { ButtonGroup, IconButton, TextField } from '@mui/material';
import { observer } from 'mobx-react';
import { useState, type ReactElement } from 'react';

interface CustomTextFieldProps {
    value: string
    onSave: (newValue: string)=>void
    onCancel: ()=>void
}

const CustomTextField = observer((props: CustomTextFieldProps):ReactElement => {
    const { value, onSave, onCancel } = props;
    const [newValue, setNewValue] = useState<string>(value);
    return (
        <TextField
            value={newValue}
            autoFocus
            size="small"
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); onSave(newValue); } }}
            onChange={(e) => setNewValue(e.target.value)}
            InputProps={{
                endAdornment: (
                    <ButtonGroup>
                        <IconButton disabled={newValue === ''} onClick={() => onSave(newValue)}>
                            <Check />
                        </IconButton>
                        <IconButton onClick={onCancel}>
                            <Close />
                        </IconButton>
                    </ButtonGroup>
                ),
            }}
        />
    );
});

export default CustomTextField;
