import { Button, CircularProgress } from "@mui/material";

export default function SubmitButton(props){
  return <Button 
    startIcon={props.submitting ? <CircularProgress size={24} /> : null} 
    disabled={props.disabled || props.submitting}
    onClick={props.onClick}
    size={props.size || "medium"}
    variant="contained"
    type={props.onClick ? "button": "submit"}>
      {props.submitting ? (props.submittingText || "Submitting...") : (props.text || props.children)}
    </Button>
}