import { Button, Card, CardActionArea, CardActions, CardContent, Fab, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useDeleteEventSeriesMutation, useListEventSeriesQuery } from "../redux/eventsApi"
import { setTitle } from "../redux/navSlice"
import Privileged from '../common/Privileged'
import { Add, Delete, Edit } from '@mui/icons-material'
import AddEventSeriesDialog from "./AddEventSeriesDialog"
import EditEventSeriesDialog from "./EditEventSeriesDialog"
import ConfirmButton from "../common/ConfirmButton"
import LocationWidget from "./LocationWidget"
import DateRangeWidget from "../common/DateRangeWidget"
import { Link } from "react-router-dom"

export default function EventSeries() {
  const dispatch = useDispatch()

  const [show, setShow] = useState(false)
  const [editEvent, setEditEvent] = useState(null)

  const {data: eventSeries, isLoading, error} = useListEventSeriesQuery(true)
  const [ deleteEventSeries, { isLoading: isDeleting } ] = useDeleteEventSeriesMutation()

  useEffect(() => {
    dispatch(setTitle("Event Series"))
  }, [dispatch])

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error}>Unable to load event series</Error>
  }

  const typeDesc = {
    "event": "Regular event",
    "social": "Social event",
    "no_impact": "Regular event, with no impact on allocations"
  }

  return <>
    <Grid container spacing={2} sx={{marginBottom: '1rem'}}>
      {eventSeries.map(e => <Grid item xs={12} key={e.eventSeriesId}>
        <Card>
          <CardContent>
            <Typography variant="h6">{e.name}</Typography>
            <Typography variant="body2">{e.description}</Typography>
            <Typography variant="body2" sx={{mt: '1rem'}}><strong>Event Type:</strong> {typeDesc[e.type]}</Typography>

            <Grid container spacing={2} sx={{mt: 1}}>
              {e["instances"].map(i => <Grid item xs={6} md={4} lg={3} xl={2}>
                <Card variant="outlined">
                  <CardActionArea sx={{p: 1, pt: '1rem'}} component={Link} to={`/events/${i["eventSeriesId"]}/${i["eventId"]}`}>
                    <DateRangeWidget startDate={i.startDate} endDate={i.endDate} marginBottom='0.5rem' />
                    <LocationWidget event={i} marginBottom='0.5rem' />
                  </CardActionArea>
                </Card>
              </Grid>)}
            </Grid>
          </CardContent>
          <Privileged allowed={["EVENTS"]}>
            <CardActions>
              <Button startIcon={<Edit />} onClick={() => setEditEvent(e)}>Edit</Button>
              {e["instances"].length === 0 ? <ConfirmButton startIcon={<Delete />} onConfirm={() => deleteEventSeries(e["eventSeriesId"])}
                  loading={isDeleting} loadingText="Deleting..."
                  body={"Are you sure you want to delete the event series "+e['name']+"? This action cannot be undone."}>Delete</ConfirmButton> : null}
            </CardActions>
          </Privileged>
        </Card>
      </Grid>)}
    </Grid>

    <Privileged allowed={["EVENTS"]}>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => setShow(true)}>
        <Add />
      </Fab>

      <AddEventSeriesDialog show={show} onClose={() => setShow(false)} existing={eventSeries.map(e => e.eventSeriesId)}/>
      <EditEventSeriesDialog show={editEvent !== null} onClose={() => setEditEvent(null)} event={editEvent} />
    </Privileged>
  </>
}